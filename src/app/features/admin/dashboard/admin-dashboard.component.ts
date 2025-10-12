import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatistiquesService, StatistiquesGlobales } from '../../../core/services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: []
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<StatistiquesGlobales | null>(null);
  loading = signal(true);

  constructor(private statistiquesService: StatistiquesService) {}

  ngOnInit() {
    this.loadStatistiques();
  }

  loadStatistiques() {
    this.statistiquesService.getStatistiquesGlobales().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
        this.loading.set(false);
      }
    });
  }
}
