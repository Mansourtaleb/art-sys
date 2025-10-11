export interface DesignPredifini {
  id: string;
  nom: string;
  description?: string;
  imageUrl: string;
  categorie: string;
  tags: string[];
  actif: boolean;
  dateCreation: Date;
  dateModification: Date;
}

export interface DesignRequest {
  nom: string;
  description?: string;
  imageUrl: string;
  categorie: string;
  tags: string[];
  actif?: boolean;
}
