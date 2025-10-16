import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OeuvreService, CategorieService } from '../../../core/services';

@Component({
  selector: 'app-gestion-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-produits.component.html',
  styleUrls: ['./gestion-produits.component.scss']
})
export class GestionProduitsComponent implements OnInit {
  loading = signal(false);
  oeuvres = signal<any[]>([]);
  categories = signal<any[]>([]);

  searchTerm = '';
  filterCategorie = '';

  oeuvresFiltered = computed(() => {
    let filtered = this.oeuvres();

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.titre?.toLowerCase().includes(term) ||
        o.artisteNom?.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term)
      );
    }

    // Filtre par catégorie
    if (this.filterCategorie) {
      filtered = filtered.filter(o =>
        o.categorieId === this.filterCategorie ||
        o.categorie === this.filterCategorie
      );
    }

    return filtered;
  });

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
    this.oeuvreService.getAllOeuvres(undefined, undefined, undefined, undefined, 0, 1000).subscribe({
      next: (page) => {
        this.oeuvres.set(page.content || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement œuvres:', err);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories(0, 100).subscribe({
      next: (page) => this.categories.set(page?.content || []),
      error: () => this.categorieService.getCategoriesActives().subscribe({
        next: (list) => this.categories.set(list || [])
      })
    });
  }

  filterOeuvres(): void {
    // Le computed s'occupe du filtrage automatiquement
  }

  deleteOeuvre(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      this.oeuvreService.deleteOeuvre(id).subscribe({
        next: () => {
          alert('✅ Œuvre supprimée');
          this.loadOeuvres();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('❌ Erreur lors de la suppression');
        }
      });
    }
  }
}

