import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FraisLivraisonService {

  private fraisParVille = new Map([
    ['Tunis', 7],
    ['Ariana', 8],
    ['Ben Arous', 8],
    ['Manouba', 8],
    ['Nabeul', 10],
    ['Sousse', 12],
    ['Sfax', 15],
    ['Monastir', 12],
    ['Bizerte', 10],
    ['Zaghouan', 10],
    ['Siliana', 12],
    ['Kairouan', 12],
    ['Kasserine', 15],
    ['Sidi Bouzid', 15],
    ['Mahdia', 12],
    ['Gabes', 15],
    ['Medenine', 18],
    ['Tataouine', 20],
    ['Gafsa', 18],
    ['Tozeur', 20],
    ['Kebili', 20],
    ['Kef', 15],
    ['Jendouba', 15],
    ['Beja', 12]
  ]);

  constructor() {}

  /**
   * Calculer les frais de livraison selon la ville et le montant
   */
  calculerFrais(ville: string, montantCommande: number): Observable<number> {
    let frais = this.fraisParVille.get(ville) || 10; // Par défaut 10 DT

    // Livraison gratuite pour les commandes >= 200 DT
    if (montantCommande >= 200) {
      frais = 0;
    }

    return of(frais);
  }

  /**
   * Obtenir la liste des villes disponibles pour la livraison
   */
  getVillesDisponibles(): string[] {
    return Array.from(this.fraisParVille.keys()).sort();
  }

  /**
   * Vérifier si une ville est disponible pour la livraison
   */
  isVilleDisponible(ville: string): boolean {
    return this.fraisParVille.has(ville);
  }

  /**
   * Obtenir les frais pour une ville spécifique
   */
  getFraisParVille(ville: string): number {
    return this.fraisParVille.get(ville) || 10;
  }

  /**
   * Estimer le délai de livraison selon la ville
   */
  getDelaiLivraison(ville: string): string {
    const villesProches = ['Tunis', 'Ariana', 'Ben Arous', 'Manouba'];
    const villesMoyennes = ['Nabeul', 'Sousse', 'Monastir', 'Bizerte', 'Zaghouan', 'Beja'];

    if (villesProches.includes(ville)) {
      return '24-48 heures';
    } else if (villesMoyennes.includes(ville)) {
      return '2-3 jours ouvrables';
    } else {
      return '3-5 jours ouvrables';
    }
  }
}




