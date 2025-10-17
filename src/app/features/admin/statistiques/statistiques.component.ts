import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService, OeuvreService, UtilisateurService } from '../../../core/services';

interface StatsPeriode {
  totalCommandes: number;
  totalRevenu: number;
  commandesMoyenne: number;
  panierMoyen: number;
}

interface TopOeuvre {
  id: string;
  titre: string;
  quantiteVendue: number;
  revenu: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent implements OnInit {
  private commandeService = inject(CommandeService);
  private oeuvreService = inject(OeuvreService);
  private utilisateurService = inject(UtilisateurService);

  // Signals
  loading = signal(false);
  periode = signal<'7j' | '30j' | '90j' | 'annee'>('30j');

  stats = signal<StatsPeriode>({
    totalCommandes: 0,
    totalRevenu: 0,
    commandesMoyenne: 0,
    panierMoyen: 0
  });

  topOeuvres = signal<TopOeuvre[]>([]);
  commandesParStatut = signal<any[]>([]);
  evolutionCA = signal<any[]>([]);

  ngOnInit(): void {
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.loading.set(true);

    // Charger les commandes
    this.commandeService.getAllCommandes().subscribe({
      next: (response: any) => {
        const commandes = response.content || [];
        this.calculateStats(commandes);
        this.calculateTopOeuvres(commandes);
        this.calculateCommandesParStatut(commandes);
        this.calculateEvolutionCA(commandes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
        this.loading.set(false);
      }
    });
  }

  changePeriode(nouvellePeriode: '7j' | '30j' | '90j' | 'annee'): void {
    this.periode.set(nouvellePeriode);
    this.loadStatistiques();
  }

  private calculateStats(commandes: any[]): void {
    const now = new Date();
    const periodeJours = this.getPeriodeJours();
    const dateDebut = new Date(now.getTime() - periodeJours * 24 * 60 * 60 * 1000);

    const commandesPeriode = commandes.filter((cmd: any) => {
      const dateCmd = new Date(cmd.dateCommande);
      return dateCmd >= dateDebut && cmd.statut !== 'ANNULEE';
    });

    const totalRevenu = commandesPeriode.reduce(
      (sum: number, cmd: any) => sum + (cmd.montantTotal || 0),
      0
    );

    this.stats.set({
      totalCommandes: commandesPeriode.length,
      totalRevenu: totalRevenu,
      commandesMoyenne: commandesPeriode.length / periodeJours,
      panierMoyen: commandesPeriode.length > 0 ? totalRevenu / commandesPeriode.length : 0
    });
  }

  private calculateTopOeuvres(commandes: any[]): void {
    const oeuvresMap = new Map<string, TopOeuvre>();

    commandes.forEach((cmd: any) => {
      if (cmd.statut === 'ANNULEE') return;

      cmd.produits?.forEach((produit: any) => {
        const existing = oeuvresMap.get(produit.oeuvreId);
        if (existing) {
          existing.quantiteVendue += produit.quantite;
          existing.revenu += produit.prix;
        } else {
          oeuvresMap.set(produit.oeuvreId, {
            id: produit.oeuvreId,
            titre: produit.titre,
            quantiteVendue: produit.quantite,
            revenu: produit.prix,
            imageUrl: produit.imageUrl
          });
        }
      });
    });

    const topOeuvres = Array.from(oeuvresMap.values())
      .sort((a, b) => b.quantiteVendue - a.quantiteVendue)
      .slice(0, 10);

    this.topOeuvres.set(topOeuvres);
  }

  private calculateCommandesParStatut(commandes: any[]): void {
    const statutCount: { [key: string]: number } = {
      'EN_ATTENTE': 0,
      'CONFIRMEE': 0,
      'EN_PREPARATION': 0,
      'EXPEDIE': 0,
      'LIVREE': 0,
      'ANNULEE': 0
    };

    commandes.forEach((cmd: any) => {
      if (statutCount[cmd.statut] !== undefined) {
        statutCount[cmd.statut]++;
      }
    });

    this.commandesParStatut.set(
      Object.entries(statutCount).map(([statut, count]) => ({
        statut,
        count,
        label: this.getStatusLabel(statut)
      }))
    );
  }

  private calculateEvolutionCA(commandes: any[]): void {
    const periodeJours = this.getPeriodeJours();
    const now = new Date();
    const evolution: any[] = [];

    for (let i = periodeJours - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      const ca = commandes
        .filter((cmd: any) => {
          const cmdDate = new Date(cmd.dateCommande).toISOString().split('T')[0];
          return cmdDate === dateStr && cmd.statut !== 'ANNULEE';
        })
        .reduce((sum: number, cmd: any) => sum + (cmd.montantTotal || 0), 0);

      evolution.push({ date: dateStr, ca });
    }

    this.evolutionCA.set(evolution);
  }

  private getPeriodeJours(): number {
    switch (this.periode()) {
      case '7j': return 7;
      case '30j': return 30;
      case '90j': return 90;
      case 'annee': return 365;
      default: return 30;
    }
  }

  private getStatusLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'EN_PREPARATION': 'En préparation',
      'EXPEDIE': 'Expédiée',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  }

  exportCSV(): void {
    alert('Export CSV - Fonctionnalité à implémenter');
  }
}
