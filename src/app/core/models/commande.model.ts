import { StatutCommande } from './enums';
import { AdresseLivraison } from './adresse-livraison.model';

export interface ProduitCommande {
  oeuvreId: string;
  titre: string;
  prix: number;
  quantite: number;
  imageUrl?: string;
}

export interface Commande {
  id: string;
  numeroCommande: string;
  clientId: string;
  clientNom: string;
  clientEmail?: string;
  clientTelephone?: string;
  produits: ProduitCommande[];
  montantTotal: number;
  adresseLivraison: AdresseLivraison;
  statut: StatutCommande;
  dateCommande: Date;
  dateModification: Date;
}

export interface CommandeRequest {
  produits: {
    oeuvreId: string;
    quantite: number;
  }[];
  adresseLivraison: AdresseLivraison;
}
