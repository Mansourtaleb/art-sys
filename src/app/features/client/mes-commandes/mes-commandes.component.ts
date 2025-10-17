import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../../core/services';
import { Commande } from '../../../core/models';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.scss'
})
export class MesCommandesComponent {
  private commandeService = inject(CommandeService);

  commandes = signal<Commande[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  expandedCommandeId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading.set(true);
    this.error.set(null);

    // CORRIGÉ : Utiliser getMesCommandes au lieu de getAllCommandes
    this.commandeService.getMesCommandes().subscribe({
      next: (commandes: Commande[]) => {
        this.commandes.set(commandes);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Erreur chargement commandes:', err);
        this.error.set('Impossible de charger les commandes');
        this.loading.set(false);
      }
    });
  }

  // NOUVEAU : Toggle détails commande
  toggleDetails(commandeId: string): void {
    if (this.expandedCommandeId() === commandeId) {
      this.expandedCommandeId.set(null);
    } else {
      this.expandedCommandeId.set(commandeId);
    }
  }

  isExpanded(commandeId: string): boolean {
    return this.expandedCommandeId() === commandeId;
  }

  // NOUVEAU : Vérifier si la commande peut être annulée
  canCancelCommande(statut: string): boolean {
    return statut === 'EN_ATTENTE';
  }

  // NOUVEAU : Annuler une commande
  annulerCommande(commandeId: string): void {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir annuler cette commande ?\n\n' +
      'Cette action est irréversible.'
    );

    if (!confirmed) {
      return;
    }

    this.loading.set(true);

    this.commandeService.annulerCommande(commandeId).subscribe({
      next: (commandeAnnulee: Commande) => {
        // Mettre à jour la commande dans la liste
        const updatedCommandes = this.commandes().map(cmd =>
          cmd.id === commandeId ? commandeAnnulee : cmd
        );
        this.commandes.set(updatedCommandes);
        this.loading.set(false);
        alert('✅ Commande annulée avec succès');
      },
      error: (err: any) => {
        console.error('Erreur annulation commande:', err);
        this.loading.set(false);
        alert('❌ Erreur lors de l\'annulation : ' + (err.error?.message || 'Erreur serveur'));
      }
    });
  }

  getStatusBadgeClass(statut: string): string {
    const statusClasses: { [key: string]: string } = {
      'EN_ATTENTE': 'bg-warning',
      'CONFIRMEE': 'bg-info',
      'EN_PREPARATION': 'bg-primary',
      'EXPEDIE': 'bg-success',
      'LIVREE': 'bg-success',
      'ANNULEE': 'bg-danger'
    };
    return statusClasses[statut] || 'bg-secondary';
  }

  getStatusLabel(statut: string): string {
    const statusLabels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'EN_PREPARATION': 'En préparation',
      'EXPEDIE': 'Expédiée',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return statusLabels[statut] || statut;
  }
}
