export interface CartItem {
  oeuvreId: string;
  titre: string;
  artiste: string;
  prix: number;
  quantite: number;
  imageUrl?: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  nombreArticles: number;
}
