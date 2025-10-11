export interface Pack {
  id: string;
  nom: string;
  description: string;
  prixTotal: number;
  produitsInclus: string[];
  imageUrl?: string;
  stock: number;
  actif: boolean;
  dateCreation: Date;
  dateModification: Date;
  nombreVentes?: number;
}

export interface PackRequest {
  nom: string;
  description: string;
  prixTotal: number;
  produitsInclus: string[];
  imageUrl?: string;
  stock: number;
  actif?: boolean;
}
