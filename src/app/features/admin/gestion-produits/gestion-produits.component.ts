import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OeuvreService } from '../../../core/services';
import { CategorieService } from '../../../core/services';
import { Oeuvre } from '../../../core/models';
import { Categorie } from '../../../core/models';


@Component({
  selector: 'app-gestion-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-produits.component.html',
  styleUrl: './gestion-produits.component.scss'
})
export class GestionProduitsComponent implements OnInit {
  oeuvres = signal<Oeuvre[]>([]);
  categories = signal<Categorie[]>([]);
  loading = signal(false);
  searchTerm = '';
  filterCategorie = '';

  // Utiliser computed signal pour le filtrage
  oeuvresFiltered = computed(() => {
    let filtered = this.oeuvres();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.titre.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term) ||
        o.artisteNom?.toLowerCase().includes(term)
      );
    }

    if (this.filterCategorie) {
      filtered = filtered.filter(o => o.categorieId === this.filterCategorie);
    }

    return filtered;
  });

  constructor(
    private oeuvreService: OeuvreService,
    private categorieService: CategorieService
  ) {}

  ngOnInit() {
    this.loadOeuvres();
    this.loadCategories();
  }

  loadOeuvres() {
    this.loading.set(true);
    this.oeuvreService.getAllOeuvres().subscribe({
      next: (data: any) => {
        const oeuvres = data.content || data;
        this.oeuvres.set(oeuvres);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement oeuvres:', err);
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data: any) => {
        const categories = data.content || data;
        this.categories.set(categories);
      },
      error: (err) => console.error('Erreur chargement catégories:', err)
    });
  }

  filterOeuvres() {
    // Le filtrage est automatique via computed signal
  }

  openModal() {
    // Implémenter l'ouverture du modal pour ajouter une oeuvre
    console.log('Ouvrir modal création');
  }

  editOeuvre(oeuvre: Oeuvre) {
    // Implémenter l'édition
    console.log('Éditer oeuvre:', oeuvre);
  }

  deleteOeuvre(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      this.oeuvreService.deleteOeuvre(id).subscribe({
        next: () => {
          console.log('Œuvre supprimée');
          this.loadOeuvres();
        },
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }
}




