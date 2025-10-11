import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  cartItemCount = this.cartService.itemCount;

  logout(): void {
    this.authService.logout();
  }
}
