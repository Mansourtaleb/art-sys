import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'art-digital-cart';

  // Signals pour réactivité
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  // Computed values - exposés directement pour les composants
  items = computed(() => this.cartItems());
  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.prix * item.quantite), 0)
  );
  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantite, 0)
  );

  // Computed cart (pour compatibilité)
  cart = computed<Cart>(() => ({
    items: this.items(),
    nombreArticles: this.itemCount(),
    total: this.total()
  }));

  constructor() {}

  // Charger le panier depuis localStorage
  private loadCartFromStorage(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  // Sauvegarder le panier dans localStorage
  private saveCartToStorage(items: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  // Ajouter un article au panier - COMPATIBLE avec addItem()
  addItem(item: Omit<CartItem, 'quantite'>, quantite: number = 1): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(i => i.oeuvreId === item.oeuvreId);

    let newItems: CartItem[];
    if (existingIndex > -1) {
      // Article existe déjà, augmenter la quantité
      newItems = currentItems.map((i, index) =>
        index === existingIndex
          ? { ...i, quantite: Math.min(i.quantite + quantite, i.stock) }
          : i
      );
    } else {
      // Nouvel article
      newItems = [...currentItems, { ...item, quantite }];
    }

    this.cartItems.set(newItems);
    this.saveCartToStorage(newItems);
  }

  // Alias pour compatibilité
  addToCart(item: Omit<CartItem, 'quantite'>, quantite: number = 1): void {
    this.addItem(item, quantite);
  }

  // Retirer un article du panier - COMPATIBLE avec removeItem()
  removeItem(oeuvreId: string): void {
    const newItems = this.cartItems().filter(item => item.oeuvreId !== oeuvreId);
    this.cartItems.set(newItems);
    this.saveCartToStorage(newItems);
  }

  // Alias pour compatibilité
  removeFromCart(oeuvreId: string): void {
    this.removeItem(oeuvreId);
  }

  // Mettre à jour la quantité
  updateQuantity(oeuvreId: string, quantite: number): void {
    const newItems = this.cartItems().map(item =>
      item.oeuvreId === oeuvreId
        ? { ...item, quantite: Math.max(1, Math.min(quantite, item.stock)) }
        : item
    );
    this.cartItems.set(newItems);
    this.saveCartToStorage(newItems);
  }

  // Vider le panier - COMPATIBLE avec clear()
  clear(): void {
    this.cartItems.set([]);
    this.saveCartToStorage([]);
  }

  // Alias pour compatibilité
  clearCart(): void {
    this.clear();
  }

  // Obtenir un article du panier
  getCartItem(oeuvreId: string): CartItem | undefined {
    return this.cartItems().find(item => item.oeuvreId === oeuvreId);
  }

  // Vérifier si un article est dans le panier
  isInCart(oeuvreId: string): boolean {
    return this.cartItems().some(item => item.oeuvreId === oeuvreId);
  }
}
