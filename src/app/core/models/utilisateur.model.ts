import { RoleUtilisateur, Genre } from './enums';
import { AdresseLivraison } from './adresse-livraison.model';

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
