import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProduitPersonnaliseService } from '../../../core/services/produit-personnalise.service';
import { FileService } from '../../../core/services/file.service';
import { ProduitPersonnaliseRequest, TypeProduit } from '../../../core/models';

@Component({
  selector: 'app-create-produit-personnalise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-produit-personnalise.component.html',
  styleUrls: ['./create-produit-personnalise.component.scss']
})
export class CreateProduitPersonnaliseComponent {
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  typeProduits = Object.keys(TypeProduit);

  form = {
    typeProduit: '',
    templateId: '',
    prix: 0,
    notes: ''
  };

  personnalisations: { key: string; value: string }[] = [ { key: '', value: '' } ];
  selectedLogo: File | null = null;
  logoUploading = signal(false);
  logoUrl: string | undefined;

  constructor(
    private produitService: ProduitPersonnaliseService,
    private fileService: FileService,
    private router: Router
  ) {}

  addPersonnalisation() { this.personnalisations.push({ key: '', value: '' }); }
  removePersonnalisation(i: number) { this.personnalisations.splice(i, 1); }

  onLogoSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { this.error.set('Logo invalide'); return; }
    this.selectedLogo = file;
  }

  private buildPayload(logoUrl?: string): ProduitPersonnaliseRequest {
    const map: Record<string, string> = {};
    this.personnalisations
      .filter(p => p.key && p.value)
      .forEach(p => { map[p.key] = p.value; });

    return {
      typeProduit: this.form.typeProduit,
      templateId: this.form.templateId,
      personnalisations: map,
      prix: this.form.prix,
      logoUrl,
      notes: this.form.notes || undefined
    };
  }

  submit() {
    this.error.set(null);
    this.success.set(false);
    if (!this.form.typeProduit || !this.form.templateId || !this.form.prix) {
      this.error.set('Veuillez remplir les champs obligatoires');
      return;
    }
    this.loading.set(true);

    const send = (payload: ProduitPersonnaliseRequest) => {
      this.produitService.creerProduitPersonnalise(payload).subscribe({
        next: () => {
          this.success.set(true);
          this.loading.set(false);
          this.router.navigate(['/client/commandes']);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Erreur création produit');
          this.loading.set(false);
        }
      });
    };

    if (this.selectedLogo) {
      this.logoUploading.set(true);
      this.fileService.uploadFile(this.selectedLogo).subscribe({
        next: (res) => { this.logoUploading.set(false); send(this.buildPayload(res.url)); },
        error: (err) => { this.logoUploading.set(false); this.error.set('Erreur upload logo'); this.loading.set(false); }
      });
    } else {
      send(this.buildPayload());
    }
  }
}

