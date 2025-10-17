import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { CategoriesComponent } from './categories/categories.component';
import { BannieresComponent } from './bannieres/bannieres.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { GestionOeuvresComponent } from './create-oeuvre/create-oeuvre.component';
import { GestionCommandesComponent } from './gestion-commandes/gestion-commandes.component';
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
import { EditOeuvreComponent } from './edit-oeuvre/edit-oeuvre.component';
import { StatistiquesComponent } from './statistiques/statistiques.component'; // NOUVEAU

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'bannieres', component: BannieresComponent },
      { path: 'utilisateurs', component: UtilisateursComponent },
      { path: 'oeuvres', component: GestionProduitsComponent },
      { path: 'oeuvres/create', component: GestionOeuvresComponent },
      { path: 'oeuvres/edit/:id', component: EditOeuvreComponent },
      { path: 'commandes', component: GestionCommandesComponent },
      { path: 'statistiques', component: StatistiquesComponent } // NOUVEAU
    ]
  }
];
