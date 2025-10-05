import { RoleUtilisateur, Genre } from './enums';

export interface AdresseLivraison {
  nom: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  parDefaut?: boolean;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  dateInscription: Date;
  photoProfile?: string;
  telephone?: string;
  dateNaissance?: Date;
  genre?: Genre;
  emailVerifie: boolean;
  adresses?: AdresseLivraison[];
}
