import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Commande, CommandeRequest, Page, StatutCommande } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = `${environment.apiUrl}/commandes`;

  constructor(private http: HttpClient) {}

  getAllCommandes(
    clientId?: string,
    statut?: StatutCommande,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Commande>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (clientId) params = params.set('clientId', clientId);
    if (statut) params = params.set('statut', statut);

    return this.http.get<Page<Commande>>(this.apiUrl, { params });
  }

  getCommandeById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  creerCommande(request: CommandeRequest): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, request);
  }

  updateStatutCommande(id: string, statut: StatutCommande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/statut`, { statut });
  }
  // Mes commandes (Client uniquement)
  getMesCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/mes-commandes`);
  }

// Annuler une commande
  annulerCommande(commandeId: string): Observable<Commande> {
    return this.http.patch<Commande>(`${this.apiUrl}/${commandeId}/annuler`, {});
  }
}
