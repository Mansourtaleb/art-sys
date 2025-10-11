import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-commandes-recues',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="py-5">
      <div class="container">
        <h1>Commandes Reçues</h1>
        <p>En cours de développement...</p>
      </div>
    </main>
    <app-footer></app-footer>
  `
})
export class CommandesRecuesComponent {}
