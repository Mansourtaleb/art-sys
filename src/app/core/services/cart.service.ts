// src/app/core/services/cart.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Cart } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'art-digital-cart';

  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  items = computed(() => this.cartItems());
  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.prix * item.quantite), 0)
  );
  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantite, 0)
  );

  cart = computed<Cart>(() => ({
    items: this.items(),
    nombreArticles: this.itemCount(),
    total: this.total()
  }));

  constructor() {}

  private loadCartFromStorage(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  addItem(item: Omit<CartItem, 'quantite'>, quantite: number = 1): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(i => i.oeuvreId === item.oeuvreId);

    let newItems: CartItem[];
    if (existingIndex > -1) {
      newItems = currentItems.map((i, index) =>
        index === existingIndex
          ? { ...i, quantite: Math.min(i.quantite + quantite, i.stock) }
          : i
      );
    } else {
      newItems = [...currentItems, { ...item, quantite }];
    }

    this.cartItems.set(newItems);
    this.saveCartToStorage(newItems);
  }

  removeItem(oeuvreId: string): void {
    const newItems = this.cartItems().filter(item => item.oeuvreId !== oeuvreId);
    this.cartItems.set(newItems);
    this.saveCartToStorage(newItems);
  }

  updateQuantity(oeuvreId: string, quantite: number): void {
    const newItems = this.cartItems().map(item =>
      item.oeuvreId === oeuvreId
        ? { ...item, quantite: Math.max(1, Math.min(quantite, item.stock)) }
        : item
    );
    this.cartItems.set(newItems);
    this.saveCartToStorage(newItems);
  }

  clear(): void {
    this.cartItems.set([]);
    this.saveCartToStorage([]);
  }

  getCartItem(oeuvreId: string): CartItem | undefined {
    return this.cartItems().find(item => item.oeuvreId === oeuvreId);
  }

  isInCart(oeuvreId: string): boolean {
    return this.cartItems().some(item => item.oeuvreId === oeuvreId);
  }
}
