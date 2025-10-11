import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FraisLivraison, FraisLivraisonRequest, FraisLivraisonCalcul, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FraisLivraisonService {
  private apiUrl = `${environment.apiUrl}/frais-livraison`;

  constructor(private http: HttpClient) {}

  // Créer frais de livraison
  createFraisLivraison(frais: FraisLivraisonRequest): Observable<FraisLivraison> {
    return this.http.post<FraisLivraison>(this.apiUrl, frais);
  }

  // Récupérer tous les frais avec pagination
  getAllFraisLivraison(page: number = 0, size: number = 10): Observable<Page<FraisLivraison>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<FraisLivraison>>(this.apiUrl, { params });
  }

  // Récupérer frais par ID
  getFraisLivraisonById(id: string): Observable<FraisLivraison> {
    return this.http.get<FraisLivraison>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour frais de livraison
  updateFraisLivraison(id: string, frais: FraisLivraisonRequest): Observable<FraisLivraison> {
    return this.http.put<FraisLivraison>(`${this.apiUrl}/${id}`, frais);
  }

  // Supprimer frais de livraison
  deleteFraisLivraison(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer frais actifs
  getFraisLivraisonActifs(): Observable<FraisLivraison[]> {
    return this.http.get<FraisLivraison[]>(`${this.apiUrl}/actifs`);
  }

  // Calculer frais de livraison
  calculerFraisLivraison(ville: string, montantCommande: number): Observable<FraisLivraisonCalcul> {
    const params = new HttpParams()
      .set('ville', ville)
      .set('montantCommande', montantCommande.toString());
    return this.http.get<FraisLivraisonCalcul>(`${this.apiUrl}/calculer`, { params });
  }

  // Récupérer frais par ville
  getFraisByVille(ville: string): Observable<FraisLivraison> {
    const params = new HttpParams().set('ville', ville);
    return this.http.get<FraisLivraison>(`${this.apiUrl}/ville`, { params });
  }

  // Récupérer frais par région
  getFraisByRegion(region: string): Observable<FraisLivraison[]> {
    const params = new HttpParams().set('region', region);
    return this.http.get<FraisLivraison[]>(`${this.apiUrl}/region`, { params });
  }

  // Activer/Désactiver
  toggleActif(id: string): Observable<FraisLivraison> {
    return this.http.patch<FraisLivraison>(`${this.apiUrl}/${id}/toggle-actif`, {});
  }
}
