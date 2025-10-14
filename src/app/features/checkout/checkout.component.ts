import { Component, OnInit, signal } from '@angular/core';
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
import { AdresseLivraison } from '../../core/models/utilisateur.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  // Étapes
  etapeActuelle = signal(1);

  // Données
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

  // Loading & errors
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor(
    private cartService: CartService,
    private commandeService: CommandeService,
    private utilisateurService: UtilisateurService,
    private authService: AuthService,
    private fraisLivraisonService: FraisLivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.items().length === 0) {
      this.router.navigate(['/panier']);
      return;
    }

    this.loadAdresses();
    this.calculerTotal();
  }

  loadAdresses(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.utilisateurService.getUtilisateurById(userId).subscribe({
      next: (user) => {
        this.adresses.set(user.adresses || []);
        const adresseParDefaut = user.adresses?.find(a => a.parDefaut);
        if (adresseParDefaut) {
          this.selectionnerAdresse(adresseParDefaut);
        }
      },
      error: (err) => console.error('Erreur chargement adresses:', err)
    });
  }

  selectionnerAdresse(adresse: AdresseLivraison): void {
    this.adresseSelectionnee.set(adresse);
    this.calculerFraisLivraison(adresse.ville);
  }

  toggleNouvelleAdresse(): void {
    this.modeNouvelleAdresse.set(!this.modeNouvelleAdresse());
  }

  calculerFraisLivraison(ville: string): void {
    this.fraisLivraisonService.calculerFrais(ville, this.total()).subscribe({
      next: (response) => {
        this.fraisLivraison.set(response.fraisStandard);
        this.calculerTotal();
      },
      error: () => {
        // Frais par défaut si erreur
        this.fraisLivraison.set(7);
        this.calculerTotal();
      }
    });
  }

  calculerTotal(): void {
    this.totalFinal.set(this.total() + this.fraisLivraison());
  }

  allerEtape(etape: number): void {
    if (etape === 2 && !this.adresseSelectionnee() && !this.modeNouvelleAdresse()) {
      this.error.set('Veuillez sélectionner une adresse de livraison');
      return;
    }
    this.error.set(null);
    this.etapeActuelle.set(etape);
  }

  confirmerCommande(): void {
    this.loading.set(true);
    this.error.set(null);

    let adresse = this.adresseSelectionnee();

    // Si nouvelle adresse, l'utiliser
    if (this.modeNouvelleAdresse()) {
      adresse = this.nouvelleAdresse();
    }

    if (!adresse) {
      this.error.set('Adresse de livraison manquante');
      this.loading.set(false);
      return;
    }

    const request = {
      produits: this.items().map(item => ({
        oeuvreId: item.oeuvreId,
        quantite: item.quantity
      })),
      adresseLivraison: adresse
    };

    this.commandeService.creerCommande(request).subscribe({
      next: (commande) => {
        this.success.set(true);
        this.cartService.clear();

        setTimeout(() => {
          this.router.navigate(['/mes-commandes']);
        }, 2000);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de la création de la commande');
        this.loading.set(false);
      }
    });
  }

  getImageUrl(oeuvre: any): string {
    if (oeuvre.imageUrl && (oeuvre.imageUrl.startsWith('http://') || oeuvre.imageUrl.startsWith('https://'))) {
      return oeuvre.imageUrl;
    }
    return 'https://placehold.co/100x100/667eea/ffffff?text=Art';
  }
}
