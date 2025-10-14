import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Statistiques {
  chiffreAffairesTotal: number;
  chiffreAffairesMois: number;
  chiffreAffairesSemaine: number;
  chiffreAffairesJour: number;
  nombreCommandesTotal: number;
  nombreCommandesMois: number;
  nombreCommandesSemaine: number;
  nombreCommandesJour: number;
  nombreClients: number;
  nombreNouveauxClientsMois: number;
  nombreProduitsEnStock: number;
  nombreProduitsStockFaible: number;
  commandesParStatut: { [key: string]: number };
  topProduits: TopProduit[];
  revenusParCategorie: { [key: string]: number };
  evolutionCA: ChiffreAffairesJour[];
  nombreRetours: number;
  nombreRetoursEnAttente: number;
}

export interface TopProduit {
  produitId: string;
  produitTitre: string;
  quantiteVendue: number;
  montantTotal: number;
}

export interface ChiffreAffairesJour {
  date: string;
  montant: number;
  nombreCommandes: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private apiUrl = `${environment.apiUrl}/statistiques`;

  constructor(private http: HttpClient) {}

  getStatistiques(): Observable<Statistiques> {
    return this.http.get<Statistiques>(this.apiUrl);
  }
}
