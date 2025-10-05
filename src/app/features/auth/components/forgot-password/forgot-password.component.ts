import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services';
import { RequestResetPasswordDTO } from '../../../../core/models';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  email = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email()) {
      this.errorMessage.set('Veuillez entrer votre email');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request: RequestResetPasswordDTO = { email: this.email() };

    this.authService.forgotPassword(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        setTimeout(() => {
          this.router.navigate(['/auth/reset-password']);
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Erreur lors de l\'envoi du code');
      }
    });
  }
}
