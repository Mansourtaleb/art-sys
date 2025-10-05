import { StatutCommande } from './enums';
import { AdresseLivraison } from './utilisateur.model';

export interface ProduitCommande {
  oeuvreId: string;
  titre: string;
  prix: number;
  quantite: number;
  imageUrl?: string;
}

export interface Commande {
  id: string;
  clientId: string;
  clientNom: string;
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
