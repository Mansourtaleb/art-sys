import { StatutProduitPersonnalise } from './enums';

export interface ProduitPersonnalise {
  id: string;
  clientId: string;
  clientNom: string;
  typeProduit: string;
  designPersonnalise: string;
  quantite: number;
  prix: number;
  statut: StatutProduitPersonnalise;
  dateCreation: Date;
  description?: string;
}

export interface ProduitPersonnaliseRequest {
  typeProduit: string;
  designPersonnalise: string;
  quantite: number;
  prix: number;
  description?: string;
}
