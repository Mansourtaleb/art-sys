import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  const requiredRoles = route.data['roles'] as string[];

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    alert('❌ Accès refusé : vous n\'avez pas les permissions nécessaires');
    router.navigate(['/']);
    return false;
  }

  return true;
};
