import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from '../../core/guards';
import { roleGuard } from '../../core/guards';
import { RoleUtilisateur } from '../../core/models';

export const clientRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard, roleGuard([RoleUtilisateur.CLIENT])]
  }
];
