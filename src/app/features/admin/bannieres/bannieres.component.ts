import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BanniereService, FileService } from '../../../core/services';
import { Banniere, TypeLienBanniere } from '../../../core/models';

@Component({
  selector: 'app-bannieres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bannieres.component.html',
  styleUrls: ['./bannieres.component.scss']
})
export class BannieresComponent {
  private banniereService = inject(BanniereService);
  private fileService = inject(FileService);

  bannieres = signal<Banniere[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  uploadingImage = signal(false);

  currentBanniere = signal<any>({
    id: '',
    titre: '',
    imageUrl: '',
    typeLien: TypeLienBanniere.EXTERNE,
    lienVers: '',
    ordre: 0,
    actif: true,
    dateDebut: undefined,
    dateFin: undefined
  });

  selectedFile: File | null = null;

  typesLiens = [
    { value: TypeLienBanniere.OEUVRE, label: 'Vers une ouvre' },
    { value: TypeLienBanniere.CATEGORIE, label: 'Vers une cat\u007fgorie' },
    { value: TypeLienBanniere.EXTERNE, label: 'Lien externe' }
  ];

  ngOnInit(): void {
    this.loadBannieres();
  }

  loadBannieres(): void {
    this.loading.set(true);
    this.banniereService.getAllBannieres().subscribe({
      next: (data: Banniere[]) => {
        this.bannieres.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        alert('? Erreur lors du chargement des banni\u007fres');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editMode.set(false);
    this.currentBanniere.set({
      id: '',
      titre: '',
      imageUrl: '',
      typeLien: TypeLienBanniere.EXTERNE,
      lienVers: '',
      ordre: 0,
      actif: true,
      dateDebut: undefined,
      dateFin: undefined
    });
    this.showModal.set(true);
  }

  openEditModal(banniere: Banniere): void {
    this.editMode.set(true);
    this.currentBanniere.set({ ...banniere });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.uploadingImage.set(true);
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        const current = this.currentBanniere();
        current.imageUrl = response.url;
        this.currentBanniere.set(current);
        this.uploadingImage.set(false);
        alert('? Image upload\u007fe avec succ\u007fs');
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        alert('? Erreur lors de l\'upload de l\'image');
        this.uploadingImage.set(false);
      }
    });
  }

  saveBanniere(): void {
    const banniere = this.currentBanniere();

    if (!banniere.titre.trim()) {
      alert('?? Le titre est obligatoire');
      return;
    }

    if (!banniere.imageUrl) {
      alert('?? L\'image est obligatoire');
      return;
    }

    // Le backend exige un lien non vide
    if (!banniere.lienVers || !String(banniere.lienVers).trim()) {
      alert('?? Le lien est obligatoire');
      return;
    }

    const data: any = this.toRequestPayload(banniere);
    const payload: any = this.cleanUndefined({ ...data });

    if (this.editMode()) {
      this.banniereService.updateBanniere(banniere.id, payload as any).subscribe({
        next: () => {
          alert('? Banni\u007fre modifi\u007fe avec succ\u007fs');
          this.closeModal();
          this.loadBannieres();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('? Erreur lors de la modification');
        }
      });
    } else {
      this.banniereService.creerBanniere(payload as any).subscribe({
        next: () => {
          alert('? Banni\u007fre cr\u007fee avec succ\u007fs');
          this.closeModal();
          this.loadBannieres();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('? Erreur lors de la cr\u007fation');
        }
      });
    }
  }

  toggleActive(banniere: Banniere): void {
    const data: any = { ...this.toRequestPayload(banniere), actif: !banniere.actif };
    const payload: any = this.cleanUndefined({ ...data });

    this.banniereService.updateBanniere(banniere.id, payload as any).subscribe({
      next: () => {
        alert(`? Banni\u007fre ${data.actif ? 'activ\u007fe' : 'd\u007fsactiv\u007fe'}`);
        this.loadBannieres();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('? Erreur lors de la modification');
      }
    });
  }

  deleteBanniere(id: string, titre: string): void {
    if (!confirm(`?? Voulez-vous vraiment supprimer la banni\u007fre "${titre}" ?`)) {
      return;
    }

    this.banniereService.deleteBanniere(id).subscribe({
      next: () => {
        alert('? Banni\u007fre supprim\u007fee avec succ\u007fs');
        this.loadBannieres();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('? Erreur lors de la suppression');
      }
    });
  }

  getTypeLienLabel(type: TypeLienBanniere): string {
    const found = this.typesLiens.find(t => t.value === type);
    return found ? found.label : type as unknown as string;
  }

  getPlaceholder(typeLien: string): string {
    if (typeLien === 'OEUVRE') return 'ID de l\'oeuvre';
    if (typeLien === 'CATEGORIE') return 'Nom de la cat\u007fgorie';
    return 'https://exemple.com';
  }

  // Convertit les valeurs de date du formulaire vers LocalDateTime (YYYY-MM-DDTHH:mm:ss)
  private normalizeDateInput(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') {
      const d = value.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        return `${d}T00:00:00`;
      }
      if (d.includes('T')) return d.substring(0, 19);
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toISOString().substring(0, 19);
    }
    return undefined;
  }

  // Ne garder que les champs attendus par le backend (BanniereRequest)
  private toRequestPayload(b: any): any {
    return {
      titre: b.titre,
      imageUrl: b.imageUrl,
      typeLien: b.typeLien,
      lienVers: b.lienVers,
      ordre: b.ordre || 0,
      actif: !!b.actif,
      dateDebut: this.normalizeDateInput(b.dateDebut),
      dateFin: this.normalizeDateInput(b.dateFin)
    };
  }

  private cleanUndefined(obj: any) {
    Object.keys(obj).forEach((k) => {
      if (obj[k] === undefined) delete obj[k];
    });
    return obj;
  }
}
