export interface FraisLivraison {
  id: string;
  ville: string;
  region: string;
  montantFrais: number;
  montantMinimumGratuit: number;
  delaiEstime: string;
  actif: boolean;
  dateCreation: Date;
  dateModification: Date;
}

export interface FraisLivraisonRequest {
  ville: string;
  region: string;
  montantFrais: number;
  montantMinimumGratuit: number;
  delaiEstime: string;
  actif?: boolean;
}

export interface FraisLivraisonCalcul {
  ville: string;
  montantCommande: number;
  fraisLivraison: number;
  livraisonGratuite: boolean;
  delaiEstime: string;
}
