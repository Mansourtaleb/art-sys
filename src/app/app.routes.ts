// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/components/home-page/home-page.component';
import { OeuvreListComponent } from './features/oeuvres/components/oeuvre-list/oeuvre-list.component';
import { OeuvreDetailComponent } from './features/oeuvres/components/oeuvre-detail/oeuvre-detail.component';
import { ProfileComponent } from './features/client/components/profile/profile.component';
import { CartPageComponent } from './features/cart/cart-page/cart-page.component';
import { CheckoutComponent } from './features/cart/checkout/checkout.component';
import { MesCommandesComponent } from './features/client/mes-commandes/mes-commandes.component';
import { authGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  // Public
  { path: '', component: HomePageComponent },
  { path: 'oeuvres', component: OeuvreListComponent },
  { path: 'oeuvres/:id', component: OeuvreDetailComponent },

  // ✅ CORRECTION : Charger TOUTES les routes auth via loadChildren
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Cart
  { path: 'cart', component: CartPageComponent },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard]
  },

  // Client
  {
    path: 'client',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENT'] },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'commandes', component: MesCommandesComponent },
      { path: 'produits/nouveau', loadComponent: () => import('./features/client/produit-personnalise/create-produit-personnalise.component').then(m => m.CreateProduitPersonnaliseComponent) },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
