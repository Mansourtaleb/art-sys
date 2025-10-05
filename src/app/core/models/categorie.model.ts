export interface Categorie {
  id: string;
  nom: string;
  description?: string;
  imageUrl?: string;
  actif: boolean;
  ordre: number;
}

export interface CategorieRequest {
  nom: string;
  description?: string;
  imageUrl?: string;
  actif?: boolean;
  ordre?: number;
}
