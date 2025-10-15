import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OeuvreService } from '../../../core/services';
import { CategorieService } from '../../../core/services';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-create-oeuvre',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-oeuvre.component.html', // Corriger le nom du template
  styleUrl: './create-oeuvre.component.scss'
})
export class GestionOeuvresComponent implements OnInit {
  // État
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Données
  categories = signal<any[]>([]);
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  // Modèle de l'œuvre
  oeuvre = {
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
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data: any) => {
        const categories = data.content || data;
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.error.set('Impossible de charger les catégories');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.error.set('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error.set('L\'image ne doit pas dépasser 5MB');
        return;
      }

      this.selectedFile = file;

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.error.set(null);
    this.loading.set(true);

    // Validation
    if (!this.oeuvre.titre || !this.oeuvre.prix || !this.oeuvre.categorieId) {
      this.error.set('Veuillez remplir tous les champs obligatoires');
      this.loading.set(false);
      return;
    }

    // Préparer les données
    const formData = new FormData();

    // Ajouter les données de l'œuvre
    formData.append('oeuvre', new Blob([JSON.stringify(this.oeuvre)], {
      type: 'application/json'
    }));

    // Ajouter l'image si sélectionnée
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Envoyer la requête
    this.oeuvreService.creerOeuvre(formData).subscribe({
      next: (response: any) => {
        this.success.set(true);
        this.loading.set(false);

        // Rediriger après 2 secondes
        setTimeout(() => {
          const userRole = this.authService.currentUser()?.role;
          if (userRole === 'ADMIN') {
            this.router.navigate(['/admin/gestion-produits']);
          } else if (userRole === 'ARTISTE') {
            this.router.navigate(['/artiste/mes-oeuvres']);
          }
        }, 2000);
      },
      error: (err: any) => {
        console.error('Erreur création œuvre:', err);
        this.error.set(err.error?.message || 'Erreur lors de la création de l\'œuvre');
        this.loading.set(false);
      }
    });
  }

  cancel() {
    const userRole = this.authService.currentUser()?.role;
    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin/gestion-produits']);
    } else if (userRole === 'ARTISTE') {
      this.router.navigate(['/artiste/mes-oeuvres']);
    } else {
      this.router.navigate(['/']);
    }
  }
}




