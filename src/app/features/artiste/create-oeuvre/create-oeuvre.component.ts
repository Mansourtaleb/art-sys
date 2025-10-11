import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { OeuvreService } from '../../../core/services/oeuvre.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { StatutOeuvre } from '../../../core/models';

@Component({
  selector: 'app-create-oeuvre',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './create-oeuvre.component.html',
  styleUrl: './create-oeuvre.component.scss'
})
export class CreateOeuvreComponent {
  private oeuvreService = inject(OeuvreService);
  private categorieService = inject(CategorieService);
  private router = inject(Router);

  categories = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
// Formulaire
  oeuvre = signal({
    titre: '',
    description: '',
    categorie: '',
    prix: 0,
    quantiteDisponible: 1,
    images: [''],
    statut: StatutOeuvre.DISPONIBLE // ✅ CORRIGÉ
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        // Le backend retourne une Page avec content
        const categoriesData = response.content || response;
        this.categories.set(categoriesData.filter((c: any) => c.active));
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
      }
    });
  }

  addImageField(): void {
    const current = this.oeuvre();
    current.images.push('');
    this.oeuvre.set({ ...current });
  }

  removeImageField(index: number): void {
    const current = this.oeuvre();
    current.images.splice(index, 1);
    this.oeuvre.set({ ...current });
  }

  updateImageUrl(index: number, value: string): void {
    const current = this.oeuvre();
    current.images[index] = value;
    this.oeuvre.set({ ...current });
  }

  async submitOeuvre(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Validation
      if (!this.oeuvre().titre || !this.oeuvre().categorie || this.oeuvre().prix <= 0) {
        this.error.set('Veuillez remplir tous les champs obligatoires');
        this.loading.set(false);
        return;
      }

      // Filtrer les images vides
      const images = this.oeuvre().images.filter(img => img.trim() !== '');

      if (images.length === 0) {
        this.error.set('Veuillez ajouter au moins une image');
        this.loading.set(false);
        return;
      }

      const oeuvreData = {
        titre: this.oeuvre().titre,
        description: this.oeuvre().description,
        categorie: this.oeuvre().categorie,
        prix: this.oeuvre().prix,
        quantiteDisponible: this.oeuvre().quantiteDisponible,
        images: images,
        statut: StatutOeuvre.DISPONIBLE // ✅ CORRIGÉ
      };
      await lastValueFrom(this.oeuvreService.creerOeuvre(oeuvreData));

      alert('✅ Œuvre créée avec succès !');
      this.router.navigate(['/artiste/mes-oeuvres']);
    } catch (err: any) {
      console.error('Erreur création œuvre:', err);
      this.error.set(err.error?.message || 'Erreur lors de la création de l\'œuvre');
    } finally {
      this.loading.set(false);
    }
  }
}
