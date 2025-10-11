import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ CORRIGÉ : enlever un ()
  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
