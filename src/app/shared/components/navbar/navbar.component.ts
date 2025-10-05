import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isAuthenticated = signal(false);
  userName = signal('');
  userRole = signal('');

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated.set(this.authService.isAuthenticated());
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.nom);
      this.userRole.set(user.role);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  goToDashboard(): void {
    const role = this.userRole();
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ARTISTE':
        this.router.navigate(['/artiste/mes-oeuvres']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client/profile']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
