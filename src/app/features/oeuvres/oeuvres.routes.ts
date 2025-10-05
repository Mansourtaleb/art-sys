import { Routes } from '@angular/router';
import { OeuvreListComponent } from './components/oeuvre-list/oeuvre-list.component';
import { OeuvreDetailComponent } from './components/oeuvre-detail/oeuvre-detail.component';

export const oeuvresRoutes: Routes = [
  { path: '', component: OeuvreListComponent },
  { path: ':id', component: OeuvreDetailComponent }
];
