import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatistiquesService, Statistiques } from '../../../core/services/statistiques.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  stats = signal<Statistiques | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Charts data
  chartCA: any = null;
  chartCategories: any = null;

  constructor(private statistiquesService: StatistiquesService) {}

  ngOnInit(): void {
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.loading.set(true);
    this.statistiquesService.getStatistiques().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);

        // Initialiser les graphiques après le chargement
        setTimeout(() => {
          this.initCharts();
        }, 100);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des statistiques');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  initCharts(): void {
    this.initChartCA();
    this.initChartCategories();
  }

  initChartCA(): void {
    const canvas = document.getElementById('chartCA') as HTMLCanvasElement;
    if (!canvas || !this.stats()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const evolutionCA = this.stats()!.evolutionCA || [];

    // Détruire le graphique existant s'il y en a un
    if (this.chartCA) {
      this.chartCA.destroy();
    }

    // Créer un graphique simple avec Canvas API
    this.drawLineChart(ctx, evolutionCA);
  }

  initChartCategories(): void {
    const canvas = document.getElementById('chartCategories') as HTMLCanvasElement;
    if (!canvas || !this.stats()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const revenusParCategorie = this.stats()!.revenusParCategorie || {};

    // Créer un graphique en barres simple
    this.drawBarChart(ctx, revenusParCategorie);
  }

  drawLineChart(ctx: CanvasRenderingContext2D, data: any[]): void {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) {
      ctx.fillStyle = '#6c757d';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Aucune donnée disponible', width / 2, height / 2);
      return;
    }

    // Trouver le max pour l'échelle
    const maxValue = Math.max(...data.map(d => d.montant), 1);
    const stepX = (width - padding * 2) / (data.length - 1 || 1);
    const stepY = (height - padding * 2) / maxValue;

    // Dessiner les axes
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Dessiner la ligne
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (point.montant * stepY);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Dessiner les points
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.stroke();

    // Dessiner les labels
    ctx.fillStyle = '#6c757d';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = height - padding + 20;
      ctx.fillText(point.date, x, y);
    });
  }

  drawBarChart(ctx: CanvasRenderingContext2D, data: { [key: string]: number }): void {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const entries = Object.entries(data);
    if (entries.length === 0) {
      ctx.fillStyle = '#6c757d';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Aucune donnée disponible', width / 2, height / 2);
      return;
    }

    const maxValue = Math.max(...entries.map(([, v]) => v), 1);
    const barWidth = (width - padding * 2) / entries.length - 10;

    // Couleurs alternées
    const colors = ['#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#10b981'];

    entries.forEach(([category, value], index) => {
      const x = padding + index * ((width - padding * 2) / entries.length);
      const barHeight = (value / maxValue) * (height - padding * 2);
      const y = height - padding - barHeight;

      // Dessiner la barre
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Dessiner la valeur
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(0) + ' DT', x + barWidth / 2, y - 5);

      // Dessiner le label
      ctx.fillStyle = '#6c757d';
      ctx.font = '11px Arial';
      ctx.save();
      ctx.translate(x + barWidth / 2, height - padding + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = 'right';
      ctx.fillText(category, 0, 0);
      ctx.restore();
    });
  }

  getStatutBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'EN_ATTENTE': 'bg-warning',
      'CONFIRMEE': 'bg-info',
      'EN_PREPARATION': 'bg-primary',
      'EXPEDIE': 'bg-success',
      'LIVREE': 'bg-success',
      'ANNULEE': 'bg-danger'
    };
    return classes[statut] || 'bg-secondary';
  }

  getStatutLabel(statut: string): string {
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
}
