import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../../core/services';
import { Utilisateur, RoleUtilisateur } from '../../../core/models';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent {
  private utilisateurService = inject(UtilisateurService);

  utilisateurs = signal<Utilisateur[]>([]);
  loading = signal(false);
  selectedRole = signal<string>('');
  searchTerm = signal('');
  showDetailModal = signal(false);
  selectedUser = signal<Utilisateur | null>(null);

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 10;

  roles = [
    { value: '', label: 'Tous les rôles' },
    { value: RoleUtilisateur.CLIENT, label: 'Clients' },
    { value: RoleUtilisateur.ARTISTE, label: 'Artistes' },
    { value: RoleUtilisateur.ADMIN, label: 'Administrateurs' }
  ];

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.loading.set(true);

    this.utilisateurService.getAllUtilisateurs(this.currentPage(), this.pageSize).subscribe({
      next: (response: any) => {
        this.utilisateurs.set(response.content || []);
        this.totalPages.set(response.totalPages || 0);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors du chargement des utilisateurs');
        this.loading.set(false);
      }
    });
  }

  get filteredUtilisateurs(): Utilisateur[] {
    let users = this.utilisateurs();

    // Filtrer par rôle
    if (this.selectedRole()) {
      users = users.filter(u => u.role === this.selectedRole());
    }

    // Filtrer par recherche
    const search = this.searchTerm().toLowerCase();
    if (search) {
      users = users.filter(u =>
        u.nom.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.telephone?.toLowerCase().includes(search)
      );
    }

    return users;
  }

  showUserDetails(user: Utilisateur): void {
    this.selectedUser.set(user);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedUser.set(null);
  }

  toggleUserStatus(user: Utilisateur): void {
    // Simuler l'activation/désactivation
    const action = user.emailVerifie ? 'désactiver' : 'activer';

    if (!confirm(`Voulez-vous vraiment ${action} l'utilisateur ${user.nom} ?`)) {
      return;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = {
      ...user,
      emailVerifie: !user.emailVerifie
    };

    this.utilisateurService.updateUtilisateur(user.id, updatedUser).subscribe({
      next: () => {
        alert(`✅ Utilisateur ${updatedUser.emailVerifie ? 'activé' : 'désactivé'} avec succès`);
        this.loadUtilisateurs();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la modification');
      }
    });
  }

  changeUserRole(user: Utilisateur, newRole: RoleUtilisateur): void {
    if (!confirm(`Voulez-vous vraiment changer le rôle de ${user.nom} ?`)) {
      return;
    }

    const updatedUser = {
      ...user,
      role: newRole
    };

    this.utilisateurService.updateUtilisateur(user.id, updatedUser).subscribe({
      next: () => {
        alert('✅ Rôle modifié avec succès');
        this.loadUtilisateurs();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la modification du rôle');
      }
    });
  }

  deleteUser(user: Utilisateur): void {
    if (!confirm(`⚠️ ATTENTION : Voulez-vous vraiment supprimer définitivement l'utilisateur ${user.nom} ?`)) {
      return;
    }

    this.utilisateurService.deleteUtilisateur(user.id).subscribe({
      next: () => {
        alert('✅ Utilisateur supprimé avec succès');
        this.loadUtilisateurs();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la suppression');
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadUtilisateurs();
  }

  getRoleBadgeClass(role: RoleUtilisateur): string {
    switch (role) {
      case RoleUtilisateur.ADMIN:
        return 'bg-danger';
      case RoleUtilisateur.ARTISTE:
        return 'bg-primary';
      case RoleUtilisateur.CLIENT:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-secondary';
  }

  exportUsers(): void {
    // Créer un CSV
    const users = this.filteredUtilisateurs;
    const headers = ['Nom', 'Email', 'Rôle', 'Téléphone', 'Date inscription', 'Statut'];

    const csvContent = [
      headers.join(','),
      ...users.map(u => [
        u.nom,
        u.email,
        u.role,
        u.telephone || '',
        new Date(u.dateInscription).toLocaleDateString(),
        u.emailVerifie ? 'Actif' : 'Inactif'
      ].join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    // Afficher max 5 pages
    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, start + 4);

    if (end - start < 4) {
      start = Math.max(0, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}




