export interface VarianteProduit {
  id: string;
  produitId: string;
  nomProduit?: string;
  taille?: string;
  couleur?: string;
  codeColeurHex?: string;
  prixSupplementaire: number;
  stock: number;
  disponible: boolean;
  dateCreation: Date;
  dateModification: Date;
}

export interface VarianteRequest {
  produitId: string;
  nomProduit?: string;
  taille?: string;
  couleur?: string;
  codeColeurHex?: string;
  prixSupplementaire: number;
  stock: number;
  disponible?: boolean;
}
