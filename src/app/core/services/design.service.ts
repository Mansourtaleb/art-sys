import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DesignPredifini, DesignRequest, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  private apiUrl = `${environment.apiUrl}/designs`;

  constructor(private http: HttpClient) {}

  // Créer un design
  createDesign(design: DesignRequest): Observable<DesignPredifini> {
    return this.http.post<DesignPredifini>(this.apiUrl, design);
  }

  // Récupérer tous les designs avec pagination
  getAllDesigns(page: number = 0, size: number = 10): Observable<Page<DesignPredifini>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<DesignPredifini>>(this.apiUrl, { params });
  }

  // Récupérer un design par ID
  getDesignById(id: string): Observable<DesignPredifini> {
    return this.http.get<DesignPredifini>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un design
  updateDesign(id: string, design: DesignRequest): Observable<DesignPredifini> {
    return this.http.put<DesignPredifini>(`${this.apiUrl}/${id}`, design);
  }

  // Supprimer un design
  deleteDesign(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les designs actifs
  getDesignsActifs(): Observable<DesignPredifini[]> {
    return this.http.get<DesignPredifini[]>(`${this.apiUrl}/actifs`);
  }

  // Récupérer designs par catégorie
  getDesignsByCategorie(categorie: string): Observable<DesignPredifini[]> {
    const params = new HttpParams().set('categorie', categorie);
    return this.http.get<DesignPredifini[]>(`${this.apiUrl}/categorie`, { params });
  }

  // Rechercher designs par tags
  searchDesignsByTags(tags: string[]): Observable<DesignPredifini[]> {
    const params = new HttpParams().set('tags', tags.join(','));
    return this.http.get<DesignPredifini[]>(`${this.apiUrl}/search`, { params });
  }

  // Activer/Désactiver un design
  toggleActif(id: string): Observable<DesignPredifini> {
    return this.http.patch<DesignPredifini>(`${this.apiUrl}/${id}/toggle-actif`, {});
  }

  // Récupérer designs populaires
  getDesignsPopulaires(limit: number = 10): Observable<DesignPredifini[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<DesignPredifini[]>(`${this.apiUrl}/populaires`, { params });
  }
}
