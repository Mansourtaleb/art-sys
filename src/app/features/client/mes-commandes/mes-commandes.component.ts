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

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.commandeService.getAllCommandes().subscribe({
      next: (response: any) => {
        // Le backend retourne une Page avec content
        const commandesData = response.content || [];
        this.commandes.set(commandesData);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Erreur chargement commandes:', err);
        this.error.set('Impossible de charger les commandes');
        this.loading.set(false);
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
