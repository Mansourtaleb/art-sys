import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categorie, CategorieRequest, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategoriesActives(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/actives`);
  }

  getAllCategories(page: number = 0, size: number = 10): Observable<Page<Categorie>> {
    return this.http.get<Page<Categorie>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getCategorieById(id: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  creerCategorie(request: CategorieRequest): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, request);
  }

  updateCategorie(id: string, request: CategorieRequest): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, request);
  }

  deleteCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
