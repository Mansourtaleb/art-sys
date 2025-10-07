import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { BanniereService } from '../../../../core/services/banniere.service';
import { CategorieService } from '../../../../core/services/categorie.service';
import { OeuvreService } from '../../../../core/services/oeuvre.service';
import { Banniere, Categorie, Oeuvre } from '../../../../core/models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  bannieres = signal<Banniere[]>([]);
  categories = signal<Categorie[]>([]);
  oeuvresVedette = signal<Oeuvre[]>([]);
  loading = signal(true);

  constructor(
    private banniereService: BanniereService,
    private categorieService: CategorieService,
    private oeuvreService: OeuvreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    // Charger les bannières actives
    this.banniereService.getBannieresActives().subscribe({
      next: (data) => this.bannieres.set(data),
      error: (err) => console.error('Erreur bannières:', err)
    });

    // Charger les catégories actives
    this.categorieService.getCategoriesActives().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erreur catégories:', err)
    });

    // Charger les oeuvres en vedette (les 6 premières)
    this.oeuvreService.getAllOeuvres(undefined, undefined, undefined, undefined, 0, 6).subscribe({
      next: (page) => {
        this.oeuvresVedette.set(page.content);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur oeuvres:', err);
        this.loading.set(false);
      }
    });
  }

  navigateToOeuvres(categorieNom?: string): void {
    if (categorieNom) {
      this.router.navigate(['/oeuvres'], { queryParams: { categorie: categorieNom } });
    } else {
      this.router.navigate(['/oeuvres']);
    }
  }

  navigateToOeuvreDetail(id: string): void {
    this.router.navigate(['/oeuvres', id]);
  }
  getValidImageUrl(url: string): string {
    // Si l'URL est valide (commence par http)
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    // Sinon, retourne un placeholder
    return 'https://placehold.co/400x300/667eea/ffffff?text=Art+Digital';
  }

  onImageError(event: any): void {
    // Si l'image ne charge pas, remplace par le placeholder
    event.target.src = 'https://placehold.co/400x300/667eea/ffffff?text=Art+Digital';
  }
}
