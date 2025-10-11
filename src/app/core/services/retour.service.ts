import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Retour, RetourRequest, Page } from '../models';
import { StatutRetour } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class RetourService {
  private apiUrl = `${environment.apiUrl}/retours`;

  constructor(private http: HttpClient) {}

  // Créer une demande de retour
  createRetour(retour: RetourRequest): Observable<Retour> {
    return this.http.post<Retour>(this.apiUrl, retour);
  }

  // Récupérer tous les retours avec pagination
  getAllRetours(page: number = 0, size: number = 10): Observable<Page<Retour>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Retour>>(this.apiUrl, { params });
  }

  // Récupérer un retour par ID
  getRetourById(id: string): Observable<Retour> {
    return this.http.get<Retour>(`${this.apiUrl}/${id}`);
  }

  // Récupérer mes retours (client)
  getMesRetours(): Observable<Retour[]> {
    return this.http.get<Retour[]>(`${this.apiUrl}/mes-retours`);
  }

  // Récupérer retours par statut
  getRetoursByStatut(statut: StatutRetour): Observable<Retour[]> {
    const params = new HttpParams().set('statut', statut);
    return this.http.get<Retour[]>(`${this.apiUrl}/statut`, { params });
  }

  // Changer le statut d'un retour (Admin)
  changerStatut(id: string, statut: StatutRetour, commentaire?: string): Observable<Retour> {
    return this.http.patch<Retour>(`${this.apiUrl}/${id}/statut`, { statut, commentaire });
  }

  // Accepter un retour
  accepterRetour(id: string, commentaire?: string): Observable<Retour> {
    return this.http.patch<Retour>(`${this.apiUrl}/${id}/accepter`, { commentaire });
  }

  // Refuser un retour
  refuserRetour(id: string, commentaire: string): Observable<Retour> {
    return this.http.patch<Retour>(`${this.apiUrl}/${id}/refuser`, { commentaire });
  }

  // Supprimer un retour
  deleteRetour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
