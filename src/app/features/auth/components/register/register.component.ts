import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest, RoleUtilisateur } from '../../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Données du formulaire
  nom = signal('');
  email = signal('');
  motDePasse = signal('');
  confirmPassword = signal('');
  telephone = signal('');
  role = signal<RoleUtilisateur>(RoleUtilisateur.CLIENT);

  roles = [
    { value: RoleUtilisateur.CLIENT, label: 'Client' },
    { value: RoleUtilisateur.ARTISTE, label: 'Artiste' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validation
    if (!this.nom() || !this.email() || !this.motDePasse()) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.motDePasse() !== this.confirmPassword()) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.motDePasse().length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Construction de l'objet request
    const formData: RegisterRequest = {
      nom: this.nom(),
      email: this.email(),
      motDePasse: this.motDePasse(),
      telephone: this.telephone() || undefined,
      role: this.role()
    };

    console.log('Envoi des données:', formData); // Pour debug

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        setTimeout(() => {
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: this.email() }
          });
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Erreur détaillée:', error); // Pour debug
        this.errorMessage.set(error.error?.message || 'Une erreur est survenue lors de l\'inscription');
      }
    });
  }
}
