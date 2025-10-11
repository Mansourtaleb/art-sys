import { Injectable, signal, computed, effect } from '@angular/core';
import { Oeuvre } from '../models';

export interface CartItem {
  oeuvre: Oeuvre;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'art_digital_cart';

  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  items = computed(() => this.cartItems());
  itemCount = computed(() =>
      this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  total = computed(() =>
      this.cartItems().reduce((sum, item) =>
          sum + (Number(item.oeuvre.prix) * item.quantity), 0
      )
  );

  constructor() {
    effect(() => {
      this.cartItems();
      this.saveToStorage();
    });
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
  }

  addItem(oeuvre: Oeuvre, quantity: number = 1): void {
    const items = [...this.cartItems()];
    const existingItem = items.find(item => item.oeuvre.id === oeuvre.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ oeuvre, quantity });
    }

    this.cartItems.set(items);
  }

  removeItem(oeuvreId: string): void {
    this.cartItems.set(
        this.cartItems().filter(item => item.oeuvre.id !== oeuvreId)
    );
  }

  updateQuantity(oeuvreId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(oeuvreId);
      return;
    }

    const items = this.cartItems().map(item =>
        item.oeuvre.id === oeuvreId ? { ...item, quantity } : item
    );
    this.cartItems.set(items);
  }

  clear(): void {
    this.cartItems.set([]);
  }

  isInCart(oeuvreId: string): boolean {
    return this.cartItems().some(item => item.oeuvre.id === oeuvreId);
  }

  getItemQuantity(oeuvreId: string): number {
    const item = this.cartItems().find(item => item.oeuvre.id === oeuvreId);
    return item?.quantity || 0;
  }
}
