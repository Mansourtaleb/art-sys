import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);

  private idCounter = 0;

  // Afficher une notification
  show(message: string, type: Notification['type'] = 'info', duration: number = 3000): void {
    const id = `notif-${this.idCounter++}`;
    const notification: Notification = { id, message, type, duration };

    this.notifications.update(notifs => [...notifs, notification]);

    // Auto-suppression après duration
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  // Raccourcis
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  // Supprimer une notification
  remove(id: string): void {
    this.notifications.update(notifs => notifs.filter(n => n.id !== id));
  }

  // Vider toutes les notifications
  clear(): void {
    this.notifications.set([]);
  }
}
