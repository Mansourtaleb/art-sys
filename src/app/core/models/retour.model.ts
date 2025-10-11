import { StatutRetour } from './enums';

export interface Retour {
  id: string;
  commandeId: string;
  clientId: string;
  clientNom: string;
  motif: string;
  description?: string;
  photosUrls: string[];
  statut: StatutRetour;
  dateCreation: Date;
  dateModification: Date;
  dateTraitement?: Date;
  commentaireAdmin?: string;
}

export interface RetourRequest {
  commandeId: string;
  motif: string;
  description?: string;
  photosUrls?: string[];
}
