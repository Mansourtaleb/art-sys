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
    dateDebut: null,
    dateFin: null
  });

  selectedFile: File | null = null;

  typesLiens = [
    { value: TypeLienBanniere.OEUVRE, label: 'Vers une œuvre' },
    { value: TypeLienBanniere.CATEGORIE, label: 'Vers une catégorie' },
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
        alert('❌ Erreur lors du chargement des bannières');
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
      dateDebut: null,
      dateFin: null
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
        alert('✅ Image uploadée avec succès');
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        alert('❌ Erreur lors de l\'upload de l\'image');
        this.uploadingImage.set(false);
      }
    });
  }

  saveBanniere(): void {
    const banniere = this.currentBanniere();

    if (!banniere.titre.trim()) {
      alert('⚠️ Le titre est obligatoire');
      return;
    }

    if (!banniere.imageUrl) {
      alert('⚠️ L\'image est obligatoire');
      return;
    }

    const data = {
      titre: banniere.titre,
      imageUrl: banniere.imageUrl,
      typeLien: banniere.typeLien,
      lienVers: banniere.lienVers,
      ordre: banniere.ordre || 0,
      actif: banniere.actif,
      dateDebut: banniere.dateDebut,
      dateFin: banniere.dateFin
    };

    if (this.editMode()) {
      this.banniereService.updateBanniere(banniere.id, data).subscribe({
        next: () => {
          alert('✅ Bannière modifiée avec succès');
          this.closeModal();
          this.loadBannieres();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('❌ Erreur lors de la modification');
        }
      });
    } else {
      this.banniereService.creerBanniere(data).subscribe({
        next: () => {
          alert('✅ Bannière créée avec succès');
          this.closeModal();
          this.loadBannieres();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('❌ Erreur lors de la création');
        }
      });
    }
  }

  toggleActive(banniere: Banniere): void {
    const data = {
      ...banniere,
      actif: !banniere.actif
    };

    this.banniereService.updateBanniere(banniere.id, data).subscribe({
      next: () => {
        alert(`✅ Bannière ${data.actif ? 'activée' : 'désactivée'}`);
        this.loadBannieres();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la modification');
      }
    });
  }

  deleteBanniere(id: string, titre: string): void {
    if (!confirm(`⚠️ Voulez-vous vraiment supprimer la bannière "${titre}" ?`)) {
      return;
    }

    this.banniereService.deleteBanniere(id).subscribe({
      next: () => {
        alert('✅ Bannière supprimée avec succès');
        this.loadBannieres();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la suppression');
      }
    });
  }

  getTypeLienLabel(type: TypeLienBanniere): string {
    const found = this.typesLiens.find(t => t.value === type);
    return found ? found.label : type;
  }

  getPlaceholder(typeLien: string): string {
    if (typeLien === 'OEUVRE') return 'ID de l\'oeuvre';
    if (typeLien === 'CATEGORIE') return 'Nom de la catégorie';
    return 'https://exemple.com';
  }
}




