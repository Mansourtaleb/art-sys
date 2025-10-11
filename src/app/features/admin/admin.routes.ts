import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'ADMIN' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      // Les autres routes seront ajoutées ici
      {
        path: 'oeuvres',
        loadChildren: () => import('./oeuvres/oeuvres.routes').then(m => m.oeuvresAdminRoutes)
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.routes').then(m => m.categoriesAdminRoutes)
      },
      {
        path: 'bannieres',
        loadChildren: () => import('./bannieres/bannieres.routes').then(m => m.bannieresAdminRoutes)
      }
    ]
  }
];