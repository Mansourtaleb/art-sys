import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../../core/services/categorie.service';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  private categorieService = inject(CategorieService);

  categories = signal<any[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);

  currentCategorie = signal({
    id: '',
    nom: '',
    description: '',
    active: true
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        const data = response.content || response;
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors du chargement des catégories');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editMode.set(false);
    this.currentCategorie.set({
      id: '',
      nom: '',
      description: '',
      active: true
    });
    this.showModal.set(true);
  }

  openEditModal(categorie: any): void {
    this.editMode.set(true);
    this.currentCategorie.set({ ...categorie });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveCategorie(): void {
    if (!this.currentCategorie().nom.trim()) {
      alert('⚠️ Le nom est obligatoire');
      return;
    }

    const data = {
      nom: this.currentCategorie().nom,
      description: this.currentCategorie().description,
      active: this.currentCategorie().active
    };

    if (this.editMode()) {
      this.categorieService.updateCategorie(this.currentCategorie().id, data).subscribe({
        next: () => {
          alert('✅ Catégorie modifiée avec succès');
          this.closeModal();
          this.loadCategories();
        },
        error: (err: any) => {
          console.error('Erreur:', err);
          alert('❌ Erreur lors de la modification');
        }
      });
    } else {
      this.categorieService.creerCategorie(data).subscribe({
        next: () => {
          alert('✅ Catégorie créée avec succès');
          this.closeModal();
          this.loadCategories();
        },
        error: (err: any) => {
          console.error('Erreur:', err);
          alert('❌ Erreur lors de la création');
        }
      });
    }
  }

  toggleActive(categorie: any): void {
    const data = {
      ...categorie,
      active: !categorie.active
    };

    this.categorieService.updateCategorie(categorie.id, data).subscribe({
      next: () => {
        alert(`✅ Catégorie ${data.active ? 'activée' : 'désactivée'}`);
        this.loadCategories();
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la modification');
      }
    });
  }

  deleteCategorie(id: string, nom: string): void {
    if (!confirm(`⚠️ Voulez-vous vraiment supprimer la catégorie "${nom}" ?`)) {
      return;
    }

    this.categorieService.deleteCategorie(id).subscribe({
      next: () => {
        alert('✅ Catégorie supprimée avec succès');
        this.loadCategories();
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la suppression');
      }
    });
  }
}
