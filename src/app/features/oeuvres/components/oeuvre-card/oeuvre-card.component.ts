import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Oeuvre, StatutOeuvre } from '../../../../core/models';

@Component({
  selector: 'app-oeuvre-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './oeuvre-card.component.html',
  styleUrl: './oeuvre-card.component.scss'
})
export class OeuvreCardComponent {
  @Input() oeuvre!: Oeuvre;
  @Input() showArtist: boolean = true;

  // Exposer l'enum au template (SANS readonly)
  StatutOeuvre = StatutOeuvre;

  // Dans oeuvre-card.component.ts
  getMainImage(): string {
    return this.oeuvre.images && this.oeuvre.images.length > 0
      ? this.oeuvre.images[0]
      : 'https://placehold.co/400x300/667eea/ffffff?text=Art+Digital';
  }
}
