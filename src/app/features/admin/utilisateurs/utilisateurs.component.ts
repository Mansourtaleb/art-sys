import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { Utilisateur } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss'
})
export class UtilisateursComponent implements OnInit {
  utilisateurs = signal<Utilisateur[]>([]);
  loading = signal(false);
  selectedUser = signal<Utilisateur | null>(null);

  // Computed signals pour les statistiques
  nombreClients = computed(() =>
    this.utilisateurs().filter(u => u.role === 'CLIENT').length
  );

  nombreArtistes = computed(() =>
    this.utilisateurs().filter(u => u.role === 'ARTISTE').length
  );

  nombreAdmins = computed(() =>
    this.utilisateurs().filter(u => u.role === 'ADMIN').length
  );

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.loading.set(true);
    this.utilisateurService.getAllUtilisateurs().subscribe({
      next: (data: any) => {
        const users = data.content || data;
        this.utilisateurs.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.loading.set(false);
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUtilisateur(userId).subscribe({
        next: () => {
          alert('✅ Utilisateur supprimé');
          this.loadUtilisateurs();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('❌ Erreur lors de la suppression');
        }
      });
    }
  }

  viewUser(user: Utilisateur) {
    this.selectedUser.set(user);
  }

  closeUserModal() {
    this.selectedUser.set(null);
  }
}
