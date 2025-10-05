import { TypeLienBanniere } from './enums';

export interface Banniere {
  id: string;
  titre: string;
  imageUrl: string;
  typeLien: TypeLienBanniere;
  lienVers: string;
  ordre: number;
  actif: boolean;
  dateDebut?: Date;
  dateFin?: Date;
}

export interface BanniereRequest {
  titre: string;
  imageUrl: string;
  typeLien: TypeLienBanniere;
  lienVers: string;
  ordre?: number;
  actif?: boolean;
  dateDebut?: Date;
  dateFin?: Date;
}
