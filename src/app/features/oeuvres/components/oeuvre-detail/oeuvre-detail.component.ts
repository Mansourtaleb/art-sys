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
    private authService: AuthService
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
  addToCart(): void {
    if (this.oeuvre()) {
      const quantity = 1; // Tu peux ajouter un input pour choisir la quantité
      this.cartService.addItem(this.oeuvre()!, quantity);

      // Toast notification (temporaire avec alert)
      alert(`✅ "${this.oeuvre()!.titre}" ajouté au panier !`);
    }
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
