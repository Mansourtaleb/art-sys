import { StatutProduitPersonnalise } from './enums';

export interface ProduitPersonnalise {
  id: string;
  clientId: string;
  clientNom: string;
  typeProduit: string;
  templateId: string;
  personnalisations: { [key: string]: string };
  prix: number;
  statut: StatutProduitPersonnalise;
  previewUrl?: string;
  dateCreation: Date;
  dateModification?: Date;
  logoUrl?: string;
  notes?: string;
}

export interface ProduitPersonnaliseRequest {
  typeProduit: string;
  templateId: string;
  personnalisations: { [key: string]: string };
  prix: number; // BigDecimal côté backend
  logoUrl?: string;
  notes?: string;
}
