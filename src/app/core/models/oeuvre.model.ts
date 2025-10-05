import { StatutOeuvre } from './enums';

export interface AvisOeuvre {
  clientId: string;
  clientNom: string;
  note: number;
  commentaire: string;
  dateAvis: Date;
}

export interface Oeuvre {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  prix: number;
  quantiteDisponible: number;
  artisteId: string;
  artisteNom: string;
  images: string[];
  statut: StatutOeuvre;
  dateCreation: Date;
  avis: AvisOeuvre[];
  notemoyenne?: number;
}

export interface OeuvreRequest {
  titre: string;
  description: string;
  categorie: string;
  prix: number;
  quantiteDisponible: number;
  images?: string[];
  statut?: StatutOeuvre;
}
