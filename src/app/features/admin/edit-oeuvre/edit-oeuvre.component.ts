import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OeuvreService, CategorieService } from '../../../core/services';
import { FileService } from '../../../core/services/file.service';
import { OeuvreRequest } from '../../../core/models';

@Component({
  selector: 'app-edit-oeuvre',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-oeuvre.component.html',
  styleUrls: ['./edit-oeuvre.component.scss']
})
export class EditOeuvreComponent implements OnInit {
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  categories = signal<any[]>([]);
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  oeuvreId: string = '';

  oeuvre: any = {
    titre: '',
    description: '',
    prix: 0,
    quantiteDisponible: 1,
    categorieId: '',
    statut: 'PUBLIE'
  };

  constructor(
    private oeuvreService: OeuvreService,
    private categorieService: CategorieService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.oeuvreId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCategories();
    this.loadOeuvre();
  }

  loadCategories(): void {
    this.categorieService.getAllCategories(0, 100).subscribe({
      next: (page) => this.categories.set(page?.content || []),
      error: () => this.categorieService.getCategoriesActives().subscribe({
        next: (list) => this.categories.set(list || [])
      })
    });
  }

  loadOeuvre(): void {
    this.loading.set(true);
    this.oeuvreService.getOeuvreById(this.oeuvreId).subscribe({
      next: (data: any) => {
        // Trouver le categorieId à partir du nom
        const categorie = this.categories().find(c => c.nom === data.categorie);

        this.oeuvre = {
          titre: data.titre,
          description: data.description,
          prix: data.prix,
          quantiteDisponible: data.quantiteDisponible,
          categorieId: categorie?.id || '',
          statut: data.statut || 'PUBLIE'
        };

        if (data.images && data.images.length > 0) {
          this.imagePreview.set(data.images[0]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement œuvre:', err);
        this.error.set('Impossible de charger l\'œuvre');
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error.set('Fichier invalide');
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    if (!this.oeuvre.titre || !this.oeuvre.prix || !this.oeuvre.categorieId) {
      this.error.set('Remplissez tous les champs obligatoires');
      this.loading.set(false);
      return;
    }

    const payload: OeuvreRequest = {
      titre: this.oeuvre.titre,
      description: this.oeuvre.description,
      categorieId: this.oeuvre.categorieId,
      prix: this.oeuvre.prix,
      quantiteDisponible: this.oeuvre.quantiteDisponible,
      statut: this.oeuvre.statut
    };

    const updateOeuvre = (images?: string[]) => {
      if (images) payload.images = images;

      this.oeuvreService.updateOeuvre(this.oeuvreId, payload).subscribe({
        next: () => {
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/admin/gestion-produits']), 1200);
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.error.set(err.error?.message || 'Erreur lors de la modification');
          this.loading.set(false);
        }
      });
    };

    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (res) => updateOeuvre([res.url]),
        error: () => {
          this.error.set('Erreur upload image');
          this.loading.set(false);
        }
      });
    } else {
      updateOeuvre();
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/gestion-produits']);
  }
}
