import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/components/home-page/home-page.component';
import { OeuvreListComponent } from './features/oeuvres/components/oeuvre-list/oeuvre-list.component';
import { OeuvreDetailComponent } from './features/oeuvres/components/oeuvre-detail/oeuvre-detail.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ProfileComponent } from './features/client/components/profile/profile.component';
import { CartPageComponent } from './features/cart/cart-page/cart-page.component';
import { CheckoutComponent } from './features/cart/checkout/checkout.component';
import { MesCommandesComponent } from './features/client/mes-commandes/mes-commandes.component';
import { authGuard, roleGuard } from './core/guards';

// Imports Artiste
import {UtilisateursComponent} from './features/admin/utilisateurs/utilisateurs.component';
import {BannieresComponent} from './features/admin/bannieres/bannieres.component';
import {CategoriesComponent} from './features/admin/categories/categories.component';
import {   DashboardAdminComponent } from './features/admin/dashboard-admin/dashboard-admin.component';
import {GestionOeuvresComponent} from './features/admin/create-oeuvre/create-oeuvre.component';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'oeuvres', component: OeuvreListComponent },
  { path: 'oeuvres/:id', component: OeuvreDetailComponent },

  // Auth
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // Cart
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },

  // Client
  {
    path: 'client',
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [roleGuard],
        data: { roles: ['CLIENT'] }
      },
      {
        path: 'commandes',
        component: MesCommandesComponent,
        canActivate: [roleGuard],
        data: { roles: ['CLIENT'] }
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },

  // Artiste
  {
    path: 'artiste',
    canActivate: [authGuard],
    children: [

      {
        path: 'create-oeuvre',
        component: GestionOeuvresComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // Routes Admin
      {
        path: 'admin',
        canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            component: DashboardAdminComponent,
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] }
          },
          {
            path: 'categories',
            component: CategoriesComponent,
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] }
          },
          {
            path: 'bannieres',
            component: BannieresComponent,
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] }
          },
          {
            path: 'utilisateurs',
            component: UtilisateursComponent,
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] }
          },
          {
            path: 'checkout',
            component: CheckoutComponent,
            canActivate: [authGuard]
          },
          {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];
