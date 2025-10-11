export enum RoleUtilisateur {
  CLIENT = 'CLIENT',
  ARTISTE = 'ARTISTE',
  ADMIN = 'ADMIN'
}

export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRMEE = 'CONFIRMEE',
  EN_PREPARATION = 'EN_PREPARATION',
  EXPEDIE = 'EXPEDIE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export enum StatutProduitPersonnalise {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  REFUSE = 'REFUSE'
}


export enum StatutOeuvre {
  DISPONIBLE = 'DISPONIBLE',
  RUPTURE_STOCK = 'RUPTURE_STOCK',
  ARCHIVE = 'ARCHIVE',
  VENDU = 'VENDU',
  EN_PROMOTION = 'EN_PROMOTION',
  BROUILLON = 'BROUILLON',  // ✅ AJOUTE CETTE LIGNE
PUBLIE = 'PUBLIE'  // ✅ AJOUTE CETTE LIGNE


}

export enum TypeLienBanniere {
  OEUVRE = 'OEUVRE',
  CATEGORIE = 'CATEGORIE',
  EXTERNE = 'EXTERNE'
}

export enum Genre {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
  AUTRE = 'AUTRE'
}
// ... enums existants ...

export enum StatutRetour {
  DEMANDE = 'DEMANDE',
  EN_COURS = 'EN_COURS',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  TERMINE = 'TERMINE'
}

export enum CategorieDesign {
  ART_ABSTRAIT = 'ART_ABSTRAIT',
  GEOMETRIQUE = 'GEOMETRIQUE',
  NATURE = 'NATURE',
  ANIMAL = 'ANIMAL',
  TYPOGRAPHIE = 'TYPOGRAPHIE',
  MINIMALISTE = 'MINIMALISTE',
  VINTAGE = 'VINTAGE',
  MODERNE = 'MODERNE'
}

export enum TypeProduit {
  TSHIRT = 'TSHIRT',
  MUG = 'MUG',
  POSTER = 'POSTER',
  STICKER = 'STICKER',
  CARTE = 'CARTE',
  COUSSIN = 'COUSSIN',
  TOILE = 'TOILE'
}
