import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CartService } from '../../../core/services';
import { CommandeService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CartItem } from '../../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private commandeService = inject(CommandeService);
  private router = inject(Router);

  items = this.cartService.items;
  total = this.cartService.total;

  adresse = signal({
    nom: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'Tunisie'
  });

  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.items().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  async submitOrder(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const commandeData = {
        produits: this.items().map((item: CartItem) => ({
          oeuvreId: item.oeuvreId,
          quantite: item.quantite
        })),
        adresseLivraison: this.adresse()
      };

      await lastValueFrom(this.commandeService.creerCommande(commandeData));
      this.cartService.clear();
      alert('✅ Commande passée avec succès !');
      this.router.navigate(['/client/commandes']);
    } catch (err: any) {
      console.error('❌ Erreur commande:', err);
      this.error.set(err.error?.message || 'Une erreur est survenue lors de la commande');
    } finally {
      this.loading.set(false);
    }
  }
}
