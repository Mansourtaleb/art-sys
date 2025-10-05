import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'oeuvres',
    loadChildren: () => import('./features/oeuvres/oeuvres.routes').then(m => m.oeuvresRoutes)
  }
];
