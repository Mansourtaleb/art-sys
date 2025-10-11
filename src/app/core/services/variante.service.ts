import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VarianteProduit, VarianteRequest, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VarianteService {
  private apiUrl = `${environment.apiUrl}/variantes`;

  constructor(private http: HttpClient) {}

  // Créer une variante
  createVariante(variante: VarianteRequest): Observable<VarianteProduit> {
    return this.http.post<VarianteProduit>(this.apiUrl, variante);
  }

  // Récupérer toutes les variantes avec pagination
  getAllVariantes(page: number = 0, size: number = 10): Observable<Page<VarianteProduit>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<VarianteProduit>>(this.apiUrl, { params });
  }

  // Récupérer une variante par ID
  getVarianteById(id: string): Observable<VarianteProduit> {
    return this.http.get<VarianteProduit>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les variantes d'un produit
  getVariantesByProduit(produitId: string): Observable<VarianteProduit[]> {
    return this.http.get<VarianteProduit[]>(`${this.apiUrl}/produit/${produitId}`);
  }

  // Mettre à jour une variante
  updateVariante(id: string, variante: VarianteRequest): Observable<VarianteProduit> {
    return this.http.put<VarianteProduit>(`${this.apiUrl}/${id}`, variante);
  }

  // Supprimer une variante
  deleteVariante(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les variantes disponibles
  getVariantesDisponibles(): Observable<VarianteProduit[]> {
    return this.http.get<VarianteProduit[]>(`${this.apiUrl}/disponibles`);
  }

  // Mettre à jour le stock
  updateStock(id: string, stock: number): Observable<VarianteProduit> {
    return this.http.patch<VarianteProduit>(`${this.apiUrl}/${id}/stock`, { stock });
  }

  // Activer/Désactiver la disponibilité
  toggleDisponibilite(id: string): Observable<VarianteProduit> {
    return this.http.patch<VarianteProduit>(`${this.apiUrl}/${id}/toggle-disponibilite`, {});
  }

  // Récupérer variantes par couleur
  getVariantesByCouleur(couleur: string): Observable<VarianteProduit[]> {
    const params = new HttpParams().set('couleur', couleur);
    return this.http.get<VarianteProduit[]>(`${this.apiUrl}/couleur`, { params });
  }

  // Récupérer variantes par taille
  getVariantesByTaille(taille: string): Observable<VarianteProduit[]> {
    const params = new HttpParams().set('taille', taille);
    return this.http.get<VarianteProduit[]>(`${this.apiUrl}/taille`, { params });
  }
}
