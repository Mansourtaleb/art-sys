import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pack, PackRequest, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private apiUrl = `${environment.apiUrl}/packs`;

  constructor(private http: HttpClient) {}

  // Créer un pack
  createPack(pack: PackRequest): Observable<Pack> {
    return this.http.post<Pack>(this.apiUrl, pack);
  }

  // Récupérer tous les packs avec pagination
  getAllPacks(page: number = 0, size: number = 10): Observable<Page<Pack>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Pack>>(this.apiUrl, { params });
  }

  // Récupérer un pack par ID
  getPackById(id: string): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un pack
  updatePack(id: string, pack: PackRequest): Observable<Pack> {
    return this.http.put<Pack>(`${this.apiUrl}/${id}`, pack);
  }

  // Supprimer un pack
  deletePack(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les packs actifs
  getPacksActifs(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/actifs`);
  }

  // Récupérer les packs en stock
  getPacksEnStock(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/en-stock`);
  }

  // Récupérer les packs populaires
  getPacksPopulaires(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/populaires`);
  }

  // Activer/Désactiver un pack
  toggleActif(id: string): Observable<Pack> {
    return this.http.patch<Pack>(`${this.apiUrl}/${id}/toggle-actif`, {});
  }

  // Mettre à jour le stock
  updateStock(id: string, stock: number): Observable<Pack> {
    return this.http.patch<Pack>(`${this.apiUrl}/${id}/stock`, { stock });
  }
}
