import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommandeService } from '../../core/services/commande.service';
import { UtilisateurService } from '../../core/services/utilisateur.service';
import { AuthService } from '../../core/services/auth.service';
import { FraisLivraisonService } from '../../core/services/frais-livraison.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AdresseLivraison } from '../../core/models/adresse-livraison.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  // Utiliser inject() pour éviter les erreurs d'initialisation
  private cartService = inject(CartService);
  private commandeService = inject(CommandeService);
  private utilisateurService = inject(UtilisateurService);
  private authService = inject(AuthService);
  private fraisLivraisonService = inject(FraisLivraisonService);
  private router = inject(Router);

  // Propriétés
  etapeActuelle = signal(1);
  items = this.cartService.items;
  total = this.cartService.total;
  fraisLivraison = signal(0);
  totalFinal = signal(0);

  // Adresses
  adresses = signal<AdresseLivraison[]>([]);
  adresseSelectionnee = signal<AdresseLivraison | null>(null);
  nouvelleAdresse = signal<AdresseLivraison>({
    rue: '',
    ville: '',
    codePostal: '',
    pays: 'Tunisie',
    parDefaut: false
  });
  modeNouvelleAdresse = signal(false);

  // État
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadAdresses();
    this.calculerTotalFinal();
  }

  loadAdresses() {
    const userId = this.authService.currentUser()?.userId; // Utiliser userId au lieu de id
    if (userId) {
      this.utilisateurService.getAdresses(userId).subscribe({
        next: (adresses: AdresseLivraison[]) => this.adresses.set(adresses),
        error: (err: any) => {
          console.error('Erreur chargement adresses:', err);
          this.error.set('Impossible de charger les adresses');
        }
      });
    }
  }

  calculerFraisLivraison() {
    const ville = this.adresseSelectionnee()?.ville || this.nouvelleAdresse().ville;
    if (ville) {
      // Calculer les frais selon la ville
      let frais = 10; // Par défaut

      if (ville === 'Tunis') {
        frais = 7;
      } else if (['Ariana', 'Ben Arous', 'Manouba'].includes(ville)) {
        frais = 8;
      }

      // Livraison gratuite au-dessus de 200 DT
      if (this.total() >= 200) {
        frais = 0;
      }

      this.fraisLivraison.set(frais);
      this.calculerTotalFinal();
    }
  }

  calculerTotalFinal() {
    this.totalFinal.set(this.total() + this.fraisLivraison());
  }

  selectAdresse(adresse: AdresseLivraison) {
    this.adresseSelectionnee.set(adresse);
    this.modeNouvelleAdresse.set(false);
    this.calculerFraisLivraison();
  }

  toggleNouvelleAdresse() {
    this.modeNouvelleAdresse.set(!this.modeNouvelleAdresse());
    if (this.modeNouvelleAdresse()) {
      this.adresseSelectionnee.set(null);
    }
  }

  nextStep() {
    if (this.etapeActuelle() < 3) {
      this.etapeActuelle.update(v => v + 1);
    }
  }

  previousStep() {
    if (this.etapeActuelle() > 1) {
      this.etapeActuelle.update(v => v - 1);
    }
  }

  passerCommande() {
    this.loading.set(true);
    this.error.set(null);

    const adresse = this.adresseSelectionnee() || this.nouvelleAdresse();

    if (!adresse.rue || !adresse.ville) {
      this.error.set('Veuillez renseigner une adresse de livraison');
      this.loading.set(false);
      return;
    }

    const commande = {
      produits: this.items().map(item => ({
        oeuvreId: item.oeuvreId,  // ✅ Correct
        quantite: item.quantite
      })),
      adresseLivraison: adresse
    };

    this.commandeService.creerCommande(commande).subscribe({
      next: (response: any) => {
        this.cartService.clearCart();
        this.router.navigate(['/client/commandes'], {
          queryParams: { success: true, orderId: response.id }
        });
      },
      error: (err: any) => {
        console.error('Erreur commande:', err);
        this.error.set(err.error?.message || 'Erreur lors de la commande');
        this.loading.set(false);
      }
    });
  }
}




