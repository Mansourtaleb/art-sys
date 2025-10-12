import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards';
import { roleGuard } from '../../core/guards';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'ADMIN' },
    children: [
      {
        path: 'admin',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      // Les autres routes seront ajoutées ici

    ]
  }
];
