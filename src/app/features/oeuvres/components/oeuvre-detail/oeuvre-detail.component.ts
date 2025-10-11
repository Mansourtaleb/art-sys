import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { OeuvreService } from '../../../../core/services';
import { AuthService } from '../../../../core/services';
import { Oeuvre } from '../../../../core/models';
import {CartService} from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-oeuvre-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './oeuvre-detail.component.html',
  styleUrl: './oeuvre-detail.component.scss'
})
export class OeuvreDetailComponent implements OnInit {
  oeuvre = signal<Oeuvre | null>(null);
  loading = signal(true);
  selectedImageIndex = signal(0);

  // Avis
  showAvisForm = signal(false);
  noteAvis = signal(5);
  commentaireAvis = signal('');
  submittingAvis = signal(false);

  isAuthenticated = signal(false);
  userRole = signal('');
  private cartService = inject(CartService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oeuvreService: OeuvreService,
    private authService: AuthService,
  private notificationService: NotificationService

) {}

  ngOnInit(): void {
    this.isAuthenticated.set(this.authService.isAuthenticated());
    const user = this.authService.currentUser();
    if (user) {
      this.userRole.set(user.role);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOeuvre(id);
    }
  }

  loadOeuvre(id: string): void {
    this.loading.set(true);
    this.oeuvreService.getOeuvreById(id).subscribe({
      next: (data) => {
        this.oeuvre.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading.set(false);
        this.router.navigate(['/oeuvres']);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  toggleAvisForm(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.userRole() !== 'CLIENT') {
      alert('Seuls les clients peuvent laisser des avis');
      return;
    }
    this.showAvisForm.set(!this.showAvisForm());
  }
  addToCart(quantity: number = 1) {
    const oeuvre = this.oeuvre();
    if (!oeuvre) return;

    // Créer l'objet CartItem à partir de l'Oeuvre
    const cartItem = {
      oeuvreId: oeuvre.id,
      titre: oeuvre.titre,
      artiste: oeuvre.artisteNom,
      prix: oeuvre.prix,
      imageUrl: oeuvre.images?.[0] || '', // ✅ Premier image du tableau
      stock: oeuvre.quantiteDisponible || 99    // ✅ Stock disponible
    };

    this.cartService.addItem(cartItem, quantity);
    this.notificationService.success('Œuvre ajoutée au panier!');
  }

  submitAvis(): void {
    if (!this.oeuvre()) return;

    this.submittingAvis.set(true);

    this.oeuvreService.ajouterAvis(
      this.oeuvre()!.id,
      this.noteAvis(),
      this.commentaireAvis()
    ).subscribe({
      next: (data) => {
        this.oeuvre.set(data);
        this.showAvisForm.set(false);
        this.noteAvis.set(5);
        this.commentaireAvis.set('');
        this.submittingAvis.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de l\'ajout de l\'avis');
        this.submittingAvis.set(false);
      }
    });
  }


  getStars(note: number): string[] {
    return Array(5).fill('').map((_, i) => i < note ? '★' : '☆');
  }

  protected readonly Math = Math;
}
