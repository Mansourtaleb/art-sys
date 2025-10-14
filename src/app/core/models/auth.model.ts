import { RoleUtilisateur } from './enums';

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role?: RoleUtilisateur;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface RequestResetPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  userId: string; // Changer 'id' en 'userId'
  nom: string;
  email: string;
  role: RoleUtilisateur;
  emailVerifie: boolean;
}




