import { StatutRetour } from './enums';

export interface Retour {
  id: string;
  commandeId: string;
  clientId: string;
  clientNom: string;
  clientEmail: string;
  motif: string;
  description: string;
  statut: StatutRetour;
  commentaireAdmin?: string;
  dateDemande: Date;
  dateTraitement?: Date;
  produitsConcernes: string;
}

export interface RetourRequest {
  commandeId: string;
  motif: string;
  description: string;
  produitsConcernes: string;
}
