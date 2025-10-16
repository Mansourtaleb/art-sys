import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OeuvreService, CategorieService, AuthService } from '../../../core/services';
import { FileService } from '../../../core/services/file.service';
import { OeuvreRequest } from '../../../core/models/oeuvre.model';

@Component({
  selector: 'app-create-oeuvre',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-oeuvre.component.html',
  styleUrls: ['./create-oeuvre.component.scss']
})
export class GestionOeuvresComponent implements OnInit {
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  showDimensions = false; // ← AJOUTER CETTE LIGNE


  categories = signal<any[]>([]);
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  get categoriesList(): any[] { return this.categories() || []; }

  // Modèle utilisé par le template (mappé vers l'API à l'envoi)
  oeuvre: any = {
    titre: '',
    description: '',
    prix: 0,
    stockDisponible: 1,
    categorieId: '',
    techniques: '',
    dimensions: {
      largeur: 0,
      hauteur: 0,
      profondeur: 0
    },
    disponible: true
  };

  constructor(
    private oeuvreService: OeuvreService,
    private categorieService: CategorieService,
    private authService: AuthService,
    private router: Router,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  };

  loadCategories = (): void => {
    this.categorieService.getAllCategories(0, 100).subscribe({
      next: (page) => this.categories.set(page?.content || []),
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.categorieService.getCategoriesActives().subscribe({
          next: (list) => this.categories.set(list || []),
          error: () => this.error.set('Impossible de charger les catégories')
        });
      }
    });
  }

  onFileSelected = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { this.error.set('Veuillez sélectionner une image valide'); return; }
    if (file.size > 5 * 1024 * 1024) { this.error.set("L'image ne doit pas dépasser 5MB"); return; }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => this.imagePreview.set((e.target?.result || '') as string);
    reader.readAsDataURL(file);
  };

  // Alias pour compatibilité éventuelle de template
  onFileChange(event: Event): void { this.onFileSelected(event); }

  onSubmit = (): void => {
    this.error.set(null);
    this.loading.set(true);

    if (!this.oeuvre.titre || !this.oeuvre.prix || !this.oeuvre.categorieId) {
      this.error.set('Veuillez remplir tous les champs obligatoires');
      this.loading.set(false);
      return;
    }

    const finalizeSuccess = () => {
      this.success.set(true);
      this.loading.set(false);
      setTimeout(() => {
        const userRole = this.authService.currentUser()?.role;
        if (userRole === 'ADMIN') this.router.navigate(['/admin/gestion-produits']);
        else if (userRole === 'ARTISTE') this.router.navigate(['/artiste/mes-oeuvres']);
        else this.router.navigate(['/']);
      }, 1200);
    };

    const buildPayload = (images?: string[]): OeuvreRequest => ({
      titre: this.oeuvre.titre,
      description: this.oeuvre.description,
      categorieId: this.oeuvre.categorieId,  // ← CORRECTION ICI
      prix: this.oeuvre.prix,
      quantiteDisponible: this.oeuvre.stockDisponible,
      images
    });

    const sendCreate = (payload: OeuvreRequest) => {
      console.log('📤 Payload envoyé:', payload);  // ← AJOUTE CETTE LIGNE

      this.oeuvreService.creerOeuvre(payload).subscribe({
        next: () => finalizeSuccess(),
        error: (err) => {
          console.error('Erreur création œuvre:', err);
          console.error('❌ Message:', err.error);  // ← AJOUTE CETTE LIGNE

          this.error.set(err.error?.message || "Erreur lors de la création de l'œuvre");
          this.loading.set(false);
        }
      });
    };

    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (res) => sendCreate(buildPayload([res.url])),
        error: () => {
          this.error.set("Erreur lors de l'upload de l'image");
          this.loading.set(false);
        }
      });
    } else {
      sendCreate(buildPayload());
    }
  };

  cancel = (): void => {
    const userRole = this.authService.currentUser()?.role;
    if (userRole === 'ADMIN') this.router.navigate(['/admin/gestion-produits']);
    else if (userRole === 'ARTISTE') this.router.navigate(['/artiste/mes-oeuvres']);
    else this.router.navigate(['/']);
  };

  // Alias de compatibilité si le template référence un autre nom
  onCancel = (): void => { this.cancel(); };
}


