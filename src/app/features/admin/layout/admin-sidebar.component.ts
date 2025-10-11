import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  @Input() collapsed = false;

  menuItems: MenuItem[] = [
    { icon: 'bi-speedometer2', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'bi-image', label: 'Œuvres', route: '/admin/oeuvres' },
    { icon: 'bi-tags', label: 'Catégories', route: '/admin/categories' },
    { icon: 'bi-card-image', label: 'Bannières', route: '/admin/bannieres' },
    { icon: 'bi-people', label: 'Utilisateurs', route: '/admin/utilisateurs' },
    { icon: 'bi-cart3', label: 'Commandes', route: '/admin/commandes' },
    { icon: 'bi-palette', label: 'Designs', route: '/admin/designs' },
    { icon: 'bi-box-seam', label: 'Packs', route: '/admin/packs' },
    { icon: 'bi-truck', label: 'Livraison', route: '/admin/frais-livraison' },
    { icon: 'bi-arrow-return-left', label: 'Retours', route: '/admin/retours' },
  ];
}
