import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../../core/services/commande.service';
import { Commande } from '../../../core/models/commande.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-gestion-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './gestion-commandes.component.html',
  styleUrl: './gestion-commandes.component.scss'
})
export class GestionCommandesComponent implements OnInit {
  commandes = signal<Commande[]>([]);
  selectedCommande = signal<Commande | null>(null);
  loading = signal(false);
  searchTerm = signal('');
  filterStatut = signal('');

  // Utiliser computed signal au lieu de getter
  commandesFiltered = computed(() => {
    let filtered = this.commandes();

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(c =>
        c.numeroCommande.toLowerCase().includes(term) ||
        c.clientNom?.toLowerCase().includes(term) ||
        c.clientEmail?.toLowerCase().includes(term)
      );
    }

    if (this.filterStatut()) {
      filtered = filtered.filter(c => c.statut === this.filterStatut());
    }

    return filtered;
  });

  constructor(private commandeService: CommandeService) {}

  ngOnInit() {
    this.loadCommandes();
  }

  loadCommandes() {
    this.loading.set(true);
    this.commandeService.getAllCommandes().subscribe({
      next: (data: any) => {
        const commandes = data.content || data;
        this.commandes.set(commandes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement commandes:', err);
        this.loading.set(false);
      }
    });
  }

  updateStatut(commandeId: string, statut: string) {
    this.commandeService.updateStatutCommande(commandeId, statut as any).subscribe({
      next: () => {
        console.log('Statut mis à jour');
        this.loadCommandes();
      },
      error: (err: any) => console.error('Erreur mise à jour statut:', err)
    });
  }

  viewDetails(commande: Commande) {
    this.selectedCommande.set(commande);
  }

  // Méthodes pour gérer les inputs
  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateFilterStatut(value: string) {
    this.filterStatut.set(value);
  }
}




