import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ResetPasswordDTO } from '../../../../core/models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  token = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.token() || !this.newPassword() || !this.confirmPassword()) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.newPassword().length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: ResetPasswordDTO = {
      token: this.token(),
      newPassword: this.newPassword()
    };

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Erreur lors de la réinitialisation');
      }
    });
  }
}
