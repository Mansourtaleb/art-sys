import { Component, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { VerifyEmailRequest } from '../../../../core/models';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  email = signal('');
  code = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email.set(params['email']);
      }
    });
  }

  onSubmit(): void {
    if (!this.code()) {
      this.errorMessage.set('Veuillez entrer le code de vérification');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: VerifyEmailRequest = { code: this.code() };

    this.authService.verifyEmail(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set('Email vérifié avec succès!');
        setTimeout(() => {
          this.redirectBasedOnRole(response.role);
        }, 1500);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Code de vérification invalide');
      }
    });
  }

  resendCode(): void {
    if (!this.email()) {
      this.errorMessage.set('Email non trouvé');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.resendVerificationCode(this.email()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Erreur lors du renvoi du code');
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
