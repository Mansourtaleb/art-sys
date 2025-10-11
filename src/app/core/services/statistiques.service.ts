import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatistiquesGlobales {
  nombreUtilisateurs: number;
  nombreClients: number;
  nombreArtistes: number;
  nombreOeuvres: number;
  nombreCommandes: number;
  revenuTotal: number;
}

export interface StatistiquesArtiste {
  nombreOeuvres: number;
  oeuvresVendues: number;
  revenuTotal: number;
  oeuvresPlusVendues: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private apiUrl = `${environment.apiUrl}/statistiques`;

  constructor(private http: HttpClient) {}

  // Statistiques globales (Admin)
  getStatistiquesGlobales(): Observable<StatistiquesGlobales> {
    return this.http.get<StatistiquesGlobales>(`${this.apiUrl}/globales`);
  }

  // Statistiques artiste
  getStatistiquesArtiste(): Observable<StatistiquesArtiste> {
    return this.http.get<StatistiquesArtiste>(`${this.apiUrl}/artiste`);
  }

  // Statistiques par période
  getStatistiquesPeriode(debut: Date, fin: Date): Observable<any> {
    const params = new HttpParams()
      .set('debut', debut.toISOString())
      .set('fin', fin.toISOString());
    return this.http.get(`${this.apiUrl}/periode`, { params });
  }
}
