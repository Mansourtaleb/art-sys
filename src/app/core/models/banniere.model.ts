import { TypeLienBanniere } from './enums';

export interface Banniere {
  id: string;
  titre: string;
  imageUrl: string;
  typeLien: TypeLienBanniere;
  lienVers: string;
  ordre: number;
  actif: boolean;
  // L'API renvoie des dates ISO; on les garde en string/null
  dateDebut?: string | null;
  dateFin?: string | null;
}

export interface BanniereRequest {
  titre: string;
  imageUrl: string;
  typeLien: TypeLienBanniere;
  lienVers: string;
  ordre?: number;
  actif?: boolean;
  // Utiliser string (LocalDateTime) pour correspondre à l'API
  dateDebut?: string;
  dateFin?: string;
}
