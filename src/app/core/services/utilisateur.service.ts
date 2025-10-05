import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Utilisateur, AdresseLivraison, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) {}

  getAllUtilisateurs(page: number = 0, size: number = 10): Observable<Page<Utilisateur>> {
    return this.http.get<Page<Utilisateur>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getUtilisateurConnecte(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/me`);
  }

  getUtilisateurById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  updateUtilisateur(id: string, utilisateur: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changePassword(id: string, ancienMotDePasse: string, nouveauMotDePasse: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/password`, {
      ancienMotDePasse,
      nouveauMotDePasse
    });
  }

  getAdresses(id: string): Observable<AdresseLivraison[]> {
    return this.http.get<AdresseLivraison[]>(`${this.apiUrl}/${id}/adresses`);
  }

  ajouterAdresse(id: string, adresse: AdresseLivraison): Observable<AdresseLivraison[]> {
    return this.http.post<AdresseLivraison[]>(`${this.apiUrl}/${id}/adresses`, adresse);
  }

  supprimerAdresse(id: string, index: number): Observable<AdresseLivraison[]> {
    return this.http.delete<AdresseLivraison[]>(`${this.apiUrl}/${id}/adresses/${index}`);
  }
}
