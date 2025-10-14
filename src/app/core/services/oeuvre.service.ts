import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Oeuvre, OeuvreRequest, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OeuvreService {
  private apiUrl = `${environment.apiUrl}/oeuvres`;

  constructor(private http: HttpClient) {}

  getAllOeuvres(
    categorie?: string,
    prixMin?: number,
    prixMax?: number,
    artisteId?: string,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Oeuvre>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (categorie) params = params.set('categorie', categorie);
    if (prixMin !== undefined) params = params.set('prixMin', prixMin.toString());
    if (prixMax !== undefined) params = params.set('prixMax', prixMax.toString());
    if (artisteId) params = params.set('artisteId', artisteId);

    return this.http.get<Page<Oeuvre>>(this.apiUrl, { params });
  }

  getOeuvreById(id: string): Observable<Oeuvre> {
    return this.http.get<Oeuvre>(`${this.apiUrl}/${id}`);
  }

  getOeuvresByArtiste(artisteId: string, page: number = 0, size: number = 10): Observable<Page<Oeuvre>> {
    return this.http.get<Page<Oeuvre>>(`${this.apiUrl}/artiste/${artisteId}?page=${page}&size=${size}`);
  }

  creerOeuvre(oeuvre: OeuvreRequest | FormData): Observable<Oeuvre> {
    return this.http.post<Oeuvre>(this.apiUrl, oeuvre);
  }

  updateOeuvre(id: string, oeuvre: OeuvreRequest): Observable<Oeuvre> {
    return this.http.put<Oeuvre>(`${this.apiUrl}/${id}`, oeuvre);
  }

  deleteOeuvre(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  ajouterAvis(id: string, note: number, commentaire: string): Observable<Oeuvre> {
    return this.http.post<Oeuvre>(`${this.apiUrl}/${id}/avis`, { note, commentaire });
  }
}
