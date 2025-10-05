import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Banniere, BanniereRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BanniereService {
  private apiUrl = `${environment.apiUrl}/bannieres`;

  constructor(private http: HttpClient) {}

  getBannieresActives(): Observable<Banniere[]> {
    return this.http.get<Banniere[]>(`${this.apiUrl}/actives`);
  }

  getAllBannieres(): Observable<Banniere[]> {
    return this.http.get<Banniere[]>(this.apiUrl);
  }

  getBanniereById(id: string): Observable<Banniere> {
    return this.http.get<Banniere>(`${this.apiUrl}/${id}`);
  }

  creerBanniere(request: BanniereRequest): Observable<Banniere> {
    return this.http.post<Banniere>(this.apiUrl, request);
  }

  updateBanniere(id: string, request: BanniereRequest): Observable<Banniere> {
    return this.http.put<Banniere>(`${this.apiUrl}/${id}`, request);
  }

  deleteBanniere(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
