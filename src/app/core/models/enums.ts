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

export enum StatutRetour {
  DEMANDE = 'DEMANDE',
  EN_COURS = 'EN_COURS',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  TERMINE = 'TERMINE'
}

export enum StatutOeuvre {
  DISPONIBLE = 'DISPONIBLE',
  RUPTURE_STOCK = 'RUPTURE_STOCK',
  ARCHIVE = 'ARCHIVE'
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
