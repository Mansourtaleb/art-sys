import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OeuvreService, CategorieService } from '../../../core/services';
import { Oeuvre, Categorie, StatutOeuvre } from '../../../core/models';

@Component({
  selector: 'app-gestion-oeuvres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-produits.component.html',
  styleUrls: ['./gestion-produits.component.scss']
})
export class GestionOeuvresComponent {
  private oeuvreService = inject(OeuvreService);
  private categorieService = inject(CategorieService);

  oeuvres = signal<Oeuvre[]>([]);
  categories = signal<Categorie[]>([]);
  loading = signal(false);

  // Filtres
  selectedCategorie = signal('');
  selectedStatut = signal('');
  searchTerm = signal('');

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 12;

  // Modal
  showDetailModal = signal(false);
  selectedOeuvre = signal<Oeuvre | null>(null);

  statuts = [
    { value: '', label: 'Tous les statuts' },
    { value: StatutOeuvre.DISPONIBLE, label: 'Disponible' },
    { value: StatutOeuvre.RUPTURE_STOCK, label: 'Rupture de stock' },
    { value: StatutOeuvre.VENDU, label: 'Vendu' },
    { value: StatutOeuvre.ARCHIVE, label: 'Archivé' },
    { value: StatutOeuvre.EN_PROMOTION, label: 'En promotion' }
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadOeuvres();
  }

  loadCategories(): void {
    this.categorieService.getCategoriesActives().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erreur catégories:', err)
    });
  }

  loadOeuvres(): void {
    this.loading.set(true);

    this.oeuvreService.getAllOeuvres(
      this.selectedCategorie() || undefined,
      undefined,
      undefined,
      undefined,
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.oeuvres.set(response.content);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors du chargement des œuvres');
        this.loading.set(false);
      }
    });
  }

  get filteredOeuvres(): Oeuvre[] {
    let oeuvres = this.oeuvres();

    // Filtrer par statut
    if (this.selectedStatut()) {
      oeuvres = oeuvres.filter(o => o.statut === this.selectedStatut());
    }

    // Filtrer par recherche
    const search = this.searchTerm().toLowerCase();
    if (search) {
      oeuvres = oeuvres.filter(o =>
        o.titre.toLowerCase().includes(search) ||
        o.artisteNom.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search)
      );
    }

    return oeuvres;
  }

  showOeuvreDetails(oeuvre: Oeuvre): void {
    this.selectedOeuvre.set(oeuvre);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedOeuvre.set(null);
  }

  changeOeuvreStatut(oeuvre: Oeuvre, newStatut: StatutOeuvre): void {
    if (!confirm(`Voulez-vous vraiment changer le statut de "${oeuvre.titre}" ?`)) {
      return;
    }

    const updatedOeuvre = {
      titre: oeuvre.titre,
      description: oeuvre.description,
      categorie: oeuvre.categorie,
      prix: oeuvre.prix,
      quantiteDisponible: oeuvre.quantiteDisponible,
      images: oeuvre.images,
      statut: newStatut
    };

    this.oeuvreService.updateOeuvre(oeuvre.id, updatedOeuvre).subscribe({
      next: () => {
        alert('✅ Statut modifié avec succès');
        this.loadOeuvres();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la modification');
      }
    });
  }

  deleteOeuvre(oeuvre: Oeuvre): void {
    if (!confirm(`⚠️ ATTENTION : Voulez-vous vraiment supprimer l'œuvre "${oeuvre.titre}" ?`)) {
      return;
    }

    this.oeuvreService.deleteOeuvre(oeuvre.id).subscribe({
      next: () => {
        alert('✅ Œuvre supprimée avec succès');
        this.loadOeuvres();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la suppression');
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadOeuvres();
  }

  applyFilters(): void {
    this.currentPage.set(0);
    this.loadOeuvres();
  }

  resetFilters(): void {
    this.selectedCategorie.set('');
    this.selectedStatut.set('');
    this.searchTerm.set('');
    this.currentPage.set(0);
    this.loadOeuvres();
  }

  getStatutBadgeClass(statut: StatutOeuvre): string {
    const classes: { [key: string]: string } = {
      [StatutOeuvre.DISPONIBLE]: 'bg-success',
      [StatutOeuvre.RUPTURE_STOCK]: 'bg-warning',
      [StatutOeuvre.VENDU]: 'bg-danger',
      [StatutOeuvre.ARCHIVE]: 'bg-secondary',
      [StatutOeuvre.EN_PROMOTION]: 'bg-info'
    };
    return classes[statut] || 'bg-secondary';
  }

  getStatutLabel(statut: StatutOeuvre): string {
    const labels: { [key: string]: string } = {
      [StatutOeuvre.DISPONIBLE]: 'Disponible',
      [StatutOeuvre.RUPTURE_STOCK]: 'Rupture stock',
      [StatutOeuvre.VENDU]: 'Vendu',
      [StatutOeuvre.ARCHIVE]: 'Archivé',
      [StatutOeuvre.EN_PROMOTION]: 'En promotion'
    };
    return labels[statut] || statut;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, start + 4);

    if (end - start < 4) {
      start = Math.max(0, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getMainImage(oeuvre: Oeuvre): string {
    return oeuvre.images && oeuvre.images.length > 0
      ? oeuvre.images[0]
      : 'https://placehold.co/200x200/667eea/ffffff?text=Sans+Image';
  }

  exportOeuvres(): void {
    const oeuvres = this.filteredOeuvres;
    const headers = ['Titre', 'Artiste', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Note moyenne'];

    const csvContent = [
      headers.join(','),
      ...oeuvres.map(o => [
        o.titre,
        o.artisteNom,
        o.categorie,
        o.prix,
        o.quantiteDisponible,
        this.getStatutLabel(o.statut),
        o.notemoyenne || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oeuvres_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}




