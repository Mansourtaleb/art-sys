import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OeuvreService } from '../../../core/services/oeuvre.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { Oeuvre, StatutOeuvre } from '../../../core/models';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-gestion-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './gestion-produits.component.html',
  styleUrl: './gestion-produits.component.scss'
})
export class GestionProduitsComponent implements OnInit {
  oeuvres = signal<Oeuvre[]>([]);
  categories = signal<any[]>([]);
  loading = signal(true);

  // Filtres
  searchTerm = signal('');
  filtreCategorie = signal('');
  filtreStatut = signal('');

  // Modal
  showModal = signal(false);
  editMode = signal(false);
  currentOeuvre = signal<any>({
    titre: '',
    description: '',
    categorie: '',
    prix: 0,
    quantiteDisponible: 1,
    images: [''],
    statut: StatutOeuvre.DISPONIBLE
  });

  StatutOeuvre = StatutOeuvre;

  constructor(
    private oeuvreService: OeuvreService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadOeuvres();
    this.loadCategories();
  }

  loadOeuvres(): void {
    this.loading.set(true);
    this.oeuvreService.getAllOeuvres().subscribe({
      next: (response: any) => {
        this.oeuvres.set(response.content || response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories.set(response.content || response);
      },
      error: (err) => console.error('Erreur catégories:', err)
    });
  }

  get oeuvresFiltered(): Oeuvre[] {
    return this.oeuvres().filter(o => {
      const matchSearch = this.searchTerm() === '' ||
        o.titre.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchCategorie = this.filtreCategorie() === '' ||
        o.categorie === this.filtreCategorie();
      const matchStatut = this.filtreStatut() === '' ||
        o.statut === this.filtreStatut();
      return matchSearch && matchCategorie && matchStatut;
    });
  }

  openModal(oeuvre?: Oeuvre): void {
    if (oeuvre) {
      this.editMode.set(true);
      this.currentOeuvre.set({ ...oeuvre });
    } else {
      this.editMode.set(false);
      this.currentOeuvre.set({
        titre: '',
        description: '',
        categorie: '',
        prix: 0,
        quantiteDisponible: 1,
        images: [''],
        statut: StatutOeuvre.DISPONIBLE
      });
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveOeuvre(): void {
    const oeuvre = this.currentOeuvre();

    if (this.editMode()) {
      this.oeuvreService.updateOeuvre(oeuvre.id, oeuvre).subscribe({
        next: () => {
          this.loadOeuvres();
          this.closeModal();
        },
        error: (err) => alert('Erreur: ' + err.error?.message)
      });
    } else {
      this.oeuvreService.creerOeuvre(oeuvre).subscribe({
        next: () => {
          this.loadOeuvres();
          this.closeModal();
        },
        error: (err) => alert('Erreur: ' + err.error?.message)
      });
    }
  }

  deleteOeuvre(id: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    this.oeuvreService.deleteOeuvre(id).subscribe({
      next: () => this.loadOeuvres(),
      error: (err) => alert('Erreur: ' + err.error?.message)
    });
  }

  addImageField(): void {
    const current = this.currentOeuvre();
    current.images.push('');
    this.currentOeuvre.set({ ...current });
  }

  removeImageField(index: number): void {
    const current = this.currentOeuvre();
    current.images.splice(index, 1);
    this.currentOeuvre.set({ ...current });
  }

  getStatutBadge(statut: StatutOeuvre): string {
    const badges: { [key in StatutOeuvre]: string } = {
      [StatutOeuvre.DISPONIBLE]: 'bg-success',
      [StatutOeuvre.RUPTURE_STOCK]: 'bg-danger',
      [StatutOeuvre.ARCHIVE]: 'bg-secondary',
      [StatutOeuvre.VENDU]: 'bg-info',
      [StatutOeuvre.EN_PROMOTION]: 'bg-warning',
      [StatutOeuvre.BROUILLON]: 'bg-secondary',
      [StatutOeuvre.PUBLIE]: 'bg-primary'
    };
    return badges[statut] || 'bg-secondary';
  }

  getImageUrl(images: string[]): string {
    if (images && images.length > 0 && images[0]) {
      return images[0];
    }
    return 'https://placehold.co/150x150/667eea/ffffff?text=Art';
  }
}
