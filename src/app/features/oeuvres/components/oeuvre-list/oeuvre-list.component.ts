import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { OeuvreService } from '../../../../core/services/oeuvre.service';
import { CategorieService } from '../../../../core/services/categorie.service';
import { Oeuvre, Categorie } from '../../../../core/models';

@Component({
  selector: 'app-oeuvre-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './oeuvre-list.component.html',
  styleUrl: './oeuvre-list.component.scss'
})
export class OeuvreListComponent implements OnInit {
  oeuvres = signal<Oeuvre[]>([]);
  categories = signal<Categorie[]>([]);
  loading = signal(true);

  // Filtres
  selectedCategorie = signal<string>('');
  prixMin = signal<number | undefined>(undefined);
  prixMax = signal<number | undefined>(undefined);

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 12;

  constructor(
    private oeuvreService: OeuvreService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger les catégories
    this.categorieService.getCategoriesActives().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erreur catégories:', err)
    });

    // Récupérer les query params (catégorie depuis home par exemple)
    this.route.queryParams.subscribe(params => {
      if (params['categorie']) {
        this.selectedCategorie.set(params['categorie']);
      }
      this.loadOeuvres();
    });
  }

  loadOeuvres(): void {
    this.loading.set(true);

    this.oeuvreService.getAllOeuvres(
      this.selectedCategorie() || undefined,
      this.prixMin(),
      this.prixMax(),
      undefined,
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (page) => {
        this.oeuvres.set(page.content);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur oeuvres:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(0);
    this.loadOeuvres();
  }

  resetFilters(): void {
    this.selectedCategorie.set('');
    this.prixMin.set(undefined);
    this.prixMax.set(undefined);
    this.currentPage.set(0);
    this.loadOeuvres();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadOeuvres();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToDetail(id: string): void {
    this.router.navigate(['/oeuvres', id]);
  }
}
