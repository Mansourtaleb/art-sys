import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { UtilisateurService } from '../../../../core/services';
import { FileService } from '../../../../core/services';
import { AuthService } from '../../../../core/services';
import { Utilisateur, AdresseLivraison, Genre } from '../../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  utilisateur = signal<Utilisateur | null>(null);
  loading = signal(true);

  // Onglets
  activeTab = signal<'infos' | 'password' | 'adresses'>('infos');

  // Édition profil
  editMode = signal(false);
  editData = signal<Partial<Utilisateur>>({});
  savingProfile = signal(false);
  profileMessage = signal('');

  // Upload photo
  selectedFile: File | null = null;
  uploadingPhoto = signal(false);

  // Changement mot de passe
  ancienMotDePasse = signal('');
  nouveauMotDePasse = signal('');
  confirmMotDePasse = signal('');
  changingPassword = signal(false);
  passwordMessage = signal('');
  passwordError = signal('');

  // Adresses
  showAdresseForm = signal(false);
  nouvelleAdresse = signal<AdresseLivraison>({
    nom: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'Tunisie',
    parDefaut: false
  });
  savingAdresse = signal(false);

  genres = [
    { value: Genre.HOMME, label: 'Homme' },
    { value: Genre.FEMME, label: 'Femme' },
    { value: Genre.AUTRE, label: 'Autre' }
  ];

  constructor(
    private utilisateurService: UtilisateurService,
    private fileService: FileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    const userId = this.authService.currentUser()?.userId;

    if (!userId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.utilisateurService.getUtilisateurById(userId).subscribe({
      next: (data) => {
        this.utilisateur.set(data);
        this.editData.set({ ...data });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        this.loading.set(false);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  switchTab(tab: 'infos' | 'password' | 'adresses'): void {
    this.activeTab.set(tab);
    this.editMode.set(false);
    this.profileMessage.set('');
    this.passwordMessage.set('');
    this.passwordError.set('');
  }

  // === ÉDITION PROFIL ===

  toggleEditMode(): void {
    if (this.editMode()) {
      this.editData.set({ ...this.utilisateur()! });
    }
    this.editMode.set(!this.editMode());
    this.profileMessage.set('');
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadPhoto();
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile) return;

    this.uploadingPhoto.set(true);
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        const updatedData = { photoProfile: response.url };
        this.utilisateurService.updateUtilisateur(this.utilisateur()!.id, updatedData).subscribe({
          next: (data) => {
            this.utilisateur.set(data);
            this.editData.set({ ...data });
            this.uploadingPhoto.set(false);
            this.profileMessage.set('Photo mise à jour avec succès');
            setTimeout(() => this.profileMessage.set(''), 3000);
          },
          error: (err) => {
            console.error('Erreur mise à jour photo:', err);
            this.uploadingPhoto.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        this.uploadingPhoto.set(false);
      }
    });
  }

  saveProfile(): void {
    this.savingProfile.set(true);
    this.profileMessage.set('');

    this.utilisateurService.updateUtilisateur(this.utilisateur()!.id, this.editData()).subscribe({
      next: (data) => {
        this.utilisateur.set(data);
        this.editData.set({ ...data });
        this.editMode.set(false);
        this.savingProfile.set(false);
        this.profileMessage.set('Profil mis à jour avec succès');
        setTimeout(() => this.profileMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.savingProfile.set(false);
        this.profileMessage.set('Erreur lors de la mise à jour');
      }
    });
  }

  // === CHANGEMENT MOT DE PASSE ===

  changePassword(): void {
    this.passwordError.set('');
    this.passwordMessage.set('');

    if (!this.ancienMotDePasse() || !this.nouveauMotDePasse() || !this.confirmMotDePasse()) {
      this.passwordError.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.nouveauMotDePasse() !== this.confirmMotDePasse()) {
      this.passwordError.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.nouveauMotDePasse().length < 6) {
      this.passwordError.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    this.changingPassword.set(true);

    this.utilisateurService.changePassword(
      this.utilisateur()!.id,
      this.ancienMotDePasse(),
      this.nouveauMotDePasse()
    ).subscribe({
      next: (response) => {
        this.changingPassword.set(false);
        this.passwordMessage.set(response.message);
        this.ancienMotDePasse.set('');
        this.nouveauMotDePasse.set('');
        this.confirmMotDePasse.set('');
        setTimeout(() => this.passwordMessage.set(''), 3000);
      },
      error: (err) => {
        this.changingPassword.set(false);
        this.passwordError.set(err.error?.message || 'Erreur lors du changement de mot de passe');
      }
    });
  }

  // === GESTION ADRESSES ===

  toggleAdresseForm(): void {
    this.showAdresseForm.set(!this.showAdresseForm());
    if (this.showAdresseForm()) {
      this.nouvelleAdresse.set({
        nom: '',
        telephone: '',
        adresse: '',
        ville: '',
        codePostal: '',
        pays: 'Tunisie',
        parDefaut: false
      });
    }
  }

  ajouterAdresse(): void {
    this.savingAdresse.set(true);

    this.utilisateurService.ajouterAdresse(this.utilisateur()!.id, this.nouvelleAdresse()).subscribe({
      next: (adresses) => {
        const updated = { ...this.utilisateur()!, adresses };
        this.utilisateur.set(updated);
        this.showAdresseForm.set(false);
        this.savingAdresse.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.savingAdresse.set(false);
      }
    });
  }

  supprimerAdresse(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      this.utilisateurService.supprimerAdresse(this.utilisateur()!.id, index).subscribe({
        next: (adresses) => {
          const updated = { ...this.utilisateur()!, adresses };
          this.utilisateur.set(updated);
        },
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}
