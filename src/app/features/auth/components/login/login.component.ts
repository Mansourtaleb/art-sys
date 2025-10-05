import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loading = signal(false);
  errorMessage = signal('');

  email = signal('');
  motDePasse = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const formData: LoginRequest = {
      email: this.email(),
      motDePasse: this.motDePasse()
    };

    this.authService.login(formData).subscribe({
      next: (response) => {
        this.loading.set(false);

        if (!response.emailVerifie) {
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: this.email() }
          });
          return;
        }

        this.redirectBasedOnRole(response.role);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Email ou mot de passe incorrect');
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ARTISTE':
        this.router.navigate(['/artiste/mes-oeuvres']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
