import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProduitPersonnalise, ProduitPersonnaliseRequest, Page, StatutProduitPersonnalise } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProduitPersonnaliseService {
  private apiUrl = `${environment.apiUrl}/produits-personnalises`;

  constructor(private http: HttpClient) {}

  getAllProduitsPersonnalises(
    statut?: StatutProduitPersonnalise,
    page: number = 0,
    size: number = 10
  ): Observable<Page<ProduitPersonnalise>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (statut) params = params.set('statut', statut);

    return this.http.get<Page<ProduitPersonnalise>>(this.apiUrl, { params });
  }

  getProduitPersonnaliseById(id: string): Observable<ProduitPersonnalise> {
    return this.http.get<ProduitPersonnalise>(`${this.apiUrl}/${id}`);
  }

  creerProduitPersonnalise(request: ProduitPersonnaliseRequest): Observable<ProduitPersonnalise> {
    return this.http.post<ProduitPersonnalise>(this.apiUrl, request);
  }

  updateProduitPersonnalise(id: string, request: ProduitPersonnaliseRequest): Observable<ProduitPersonnalise> {
    return this.http.put<ProduitPersonnalise>(`${this.apiUrl}/${id}`, request);
  }

  updateStatutProduit(id: string, statut: StatutProduitPersonnalise): Observable<ProduitPersonnalise> {
    return this.http.put<ProduitPersonnalise>(`${this.apiUrl}/${id}/statut`, { statut });
  }
}
