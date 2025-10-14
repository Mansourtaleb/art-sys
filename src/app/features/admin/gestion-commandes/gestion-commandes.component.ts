import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../../core/services/commande.service';
import { Commande, StatutCommande, StatutCommandeLabels, StatutCommandeColors } from '../../../core/models';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-gestion-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './gestion-commandes.component.html',
  styleUrl: './gestion-commandes.component.scss'
})
export class GestionCommandesComponent implements OnInit {
  commandes = signal<Commande[]>([]);
  loading = signal(true);

  filtreStatut = signal('');
  searchTerm = signal('');

  showDetailModal = signal(false);
  selectedCommande = signal<Commande | null>(null);

  StatutCommande = StatutCommande;
  StatutCommandeLabels = StatutCommandeLabels;
  StatutCommandeColors = StatutCommandeColors;

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading.set(true);
    this.commandeService.getAllCommandes().subscribe({
      next: (response: any) => {
        this.commandes.set(response.content || response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  get commandesFiltered(): Commande[] {
    return this.commandes().filter(c => {
      const matchStatut = this.filtreStatut() === '' || c.statut === this.filtreStatut();
      const matchSearch = this.searchTerm() === '' ||
        c.clientNom.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        c.id.toLowerCase().includes(this.searchTerm().toLowerCase());
      return matchStatut && matchSearch;
    });
  }

  viewDetails(commande: Commande): void {
    this.selectedCommande.set(commande);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
  }

  changerStatut(commandeId: string, nouveauStatut: StatutCommande): void {
    this.commandeService.updateStatutCommande(commandeId, nouveauStatut).subscribe({
      next: () => {
        this.loadCommandes();
        if (this.selectedCommande()?.id === commandeId) {
          this.closeDetailModal();
        }
      },
      error: (err) => alert('Erreur: ' + err.error?.message)
    });
  }

  getStatutBadge(statut: StatutCommande): string {
    return `bg-${StatutCommandeColors[statut]}`;
  }

  getStatutLabel(statut: StatutCommande): string {
    return StatutCommandeLabels[statut];
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProchainStatuts(statutActuel: StatutCommande): StatutCommande[] {
    const workflow: { [key in StatutCommande]?: StatutCommande[] } = {
      [StatutCommande.EN_ATTENTE]: [StatutCommande.CONFIRMEE, StatutCommande.ANNULEE],
      [StatutCommande.CONFIRMEE]: [StatutCommande.EN_PREPARATION, StatutCommande.ANNULEE],
      [StatutCommande.EN_PREPARATION]: [StatutCommande.EXPEDIE],
      [StatutCommande.EXPEDIE]: [StatutCommande.LIVREE]
    };
    return workflow[statutActuel] || [];
  }
}
