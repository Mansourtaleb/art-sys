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
  BROUILLON = 'BROUILLON',
  PUBLIE = 'PUBLIE'
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
  MODERNE = 'MODERNE',
  ENFANT = 'ENFANT',
  SPORT = 'SPORT',
  MUSIQUE = 'MUSIQUE',
  GAMING = 'GAMING',
  CINEMA = 'CINEMA',
  PROFESSIONNEL = 'PROFESSIONNEL',
  FETE = 'FETE',
  MARIAGE = 'MARIAGE',
  NAISSANCE = 'NAISSANCE',
  HUMOUR = 'HUMOUR',
  INSPIRANT = 'INSPIRANT',
  CALLIGRAPHIE = 'CALLIGRAPHIE'
}

export enum TypeProduit {
  // Vêtements
  TSHIRT = 'TSHIRT',
  POLO = 'POLO',
  SWEAT = 'SWEAT',
  HOODIE = 'HOODIE',
  CASQUETTE = 'CASQUETTE',

  // Articles de bureau
  MUG = 'MUG',
  MUG_MAGIQUE = 'MUG_MAGIQUE',
  STYLO = 'STYLO',
  CAHIER = 'CAHIER',
  AGENDA = 'AGENDA',
  CALENDRIER = 'CALENDRIER',
  BLOC_NOTES = 'BLOC_NOTES',
  PORTE_CLE = 'PORTE_CLE',

  // Impression papier
  POSTER = 'POSTER',
  TOILE = 'TOILE',
  CARTE_POSTALE = 'CARTE_POSTALE',
  CARTE_VISITE = 'CARTE_VISITE',
  FLYER = 'FLYER',
  BROCHURE = 'BROCHURE',
  DEPLIANT = 'DEPLIANT',
  AFFICHE = 'AFFICHE',
  BANNIERE = 'BANNIERE',

  // Événements
  FAIRE_PART = 'FAIRE_PART',
  INVITATION = 'INVITATION',
  MENU = 'MENU',
  MARQUE_PLACE = 'MARQUE_PLACE',
  ETIQUETTE = 'ETIQUETTE',

  // Décoration
  STICKER = 'STICKER',
  COUSSIN = 'COUSSIN',
  TABLEAU = 'TABLEAU',
  HORLOGE = 'HORLOGE',
  TAPIS_SOURIS = 'TAPIS_SOURIS',

  // Cadeaux
  SAC_TOTE = 'SAC_TOTE',
  PUZZLE = 'PUZZLE',
  MAGNET = 'MAGNET',
  BADGE = 'BADGE',

  // Emballage
  SACHET = 'SACHET',
  BOITE = 'BOITE',
  PAPIER_CADEAU = 'PAPIER_CADEAU'
}

export enum TailleVetement {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL'
}

export enum Occasion {
  MARIAGE = 'MARIAGE',
  NAISSANCE = 'NAISSANCE',
  ANNIVERSAIRE = 'ANNIVERSAIRE',
  ENTREPRISE = 'ENTREPRISE',
  ETUDIANT = 'ETUDIANT',
  STARTUP = 'STARTUP',
  EVENEMENT = 'EVENEMENT',
  SAINT_VALENTIN = 'SAINT_VALENTIN',
  FETE_MERES = 'FETE_MERES',
  FETE_PERES = 'FETE_PERES',
  RAMADAN = 'RAMADAN',
  AID = 'AID',
  RENTREE_SCOLAIRE = 'RENTREE_SCOLAIRE',
  NOEL = 'NOEL',
  NOUVEL_AN = 'NOUVEL_AN',
  AUTRE = 'AUTRE'
}

// Helpers pour affichage
export const TypeProduitLabels: { [key in TypeProduit]: string } = {
  TSHIRT: 'T-Shirt',
  POLO: 'Polo',
  SWEAT: 'Sweat-shirt',
  HOODIE: 'Hoodie',
  CASQUETTE: 'Casquette',
  MUG: 'Mug',
  MUG_MAGIQUE: 'Mug Magique',
  STYLO: 'Stylo',
  CAHIER: 'Cahier',
  AGENDA: 'Agenda',
  CALENDRIER: 'Calendrier',
  BLOC_NOTES: 'Bloc-notes',
  PORTE_CLE: 'Porte-clés',
  POSTER: 'Poster',
  TOILE: 'Toile',
  CARTE_POSTALE: 'Carte postale',
  CARTE_VISITE: 'Carte de visite',
  FLYER: 'Flyer',
  BROCHURE: 'Brochure',
  DEPLIANT: 'Dépliant',
  AFFICHE: 'Affiche',
  BANNIERE: 'Bannière',
  FAIRE_PART: 'Faire-part',
  INVITATION: 'Invitation',
  MENU: 'Menu',
  MARQUE_PLACE: 'Marque-place',
  ETIQUETTE: 'Étiquette',
  STICKER: 'Sticker',
  COUSSIN: 'Coussin',
  TABLEAU: 'Tableau',
  HORLOGE: 'Horloge',
  TAPIS_SOURIS: 'Tapis de souris',
  SAC_TOTE: 'Tote Bag',
  PUZZLE: 'Puzzle',
  MAGNET: 'Magnet',
  BADGE: 'Badge',
  SACHET: 'Sachet',
  BOITE: 'Boîte',
  PAPIER_CADEAU: 'Papier cadeau'
};

export const StatutCommandeLabels: { [key in StatutCommande]: string } = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_PREPARATION: 'En préparation',
  EXPEDIE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée'
};

export const StatutCommandeColors: { [key in StatutCommande]: string } = {
  EN_ATTENTE: 'warning',
  CONFIRMEE: 'info',
  EN_PREPARATION: 'primary',
  EXPEDIE: 'success',
  LIVREE: 'success',
  ANNULEE: 'danger'
};
