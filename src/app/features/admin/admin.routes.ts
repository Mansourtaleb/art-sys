import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/guards';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { CategoriesComponent } from './categories/categories.component';
import { BannieresComponent } from './bannieres/bannieres.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import {GestionOeuvresComponent} from './create-oeuvre/create-oeuvre.component';
import {GestionCommandesComponent} from './gestion-commandes/gestion-commandes.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardAdminComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'bannieres',
        component: BannieresComponent
      },
      {
        path: 'utilisateurs',
        component: UtilisateursComponent
      },
      {
        path: 'oeuvres',
        component: GestionOeuvresComponent
      },
      {
        path: 'commandes',
        component: GestionCommandesComponent
      }
    ]
  }
];
