import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  cartService = inject(CartService);
  router = inject(Router);

  items = this.cartService.items;
  total = this.cartService.total;
  itemCount = this.cartService.itemCount;

  updateQuantity(oeuvreId: string, quantity: number): void {
    this.cartService.updateQuantity(oeuvreId, quantity);
  }

  removeItem(oeuvreId: string): void {
    if (confirm('Voulez-vous vraiment retirer cet article du panier ?')) {
      this.cartService.removeItem(oeuvreId);
    }
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider le panier ?')) {
      this.cartService.clear();
    }
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  getImageUrl(oeuvre: any): string {
    if (oeuvre.images && oeuvre.images.length > 0) {
      const url = oeuvre.images[0];
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        return url;
      }
    }
    return 'https://placehold.co/150x150/667eea/ffffff?text=Art';
  }
}
