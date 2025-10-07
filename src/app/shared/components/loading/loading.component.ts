import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() message: string = 'Chargement...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overlay: boolean = false;
}
