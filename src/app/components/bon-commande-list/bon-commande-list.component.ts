// src/app/components/bon-commande-list/bon-commande-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonCommande, BonCommandeService, Contenir } from '../../services/bon-commande.service';
import { BonCommandeFormComponent } from '../bon-commande-form/bon-commande-form.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bon-commande-list',
  standalone: true,
  imports: [CommonModule, BonCommandeFormComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './bon-commande-list.component.html',
  styleUrls: ['./bon-commande-list.component.css']
})
export class BonCommandeListComponent implements OnInit {
  commandes: BonCommande[] = [];
  /** La commande sélectionnée pour être modifiée, ou null pour création */
  selectedBon: BonCommande | null = null;

  constructor(private bonService: BonCommandeService) { }

  showForm = false;

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.bonService.getAll().subscribe({
      next: (data) => this.commandes = data,
      error: (err) => console.error(err)
    });
  }

  /** Quand on clique sur "Modifier" */
  editBon(bon: BonCommande): void {
    this.selectedBon = { ...bon };
    this.toggleForm();
  }

  /** Supprimer une commande entière */
  deleteBon(id_bon: number): void {
    if (!confirm(`Supprimer la commande ${id_bon} ?`)) return;
    this.bonService.delete(id_bon).subscribe({
      next: () => this.reload(),
      error: (err) => console.error(err)
    });
  }

  /** Supprimer une ligne spécifique */
  deleteLigne(id_bon: number, ref_scooter: string): void {
    if (!confirm(`Supprimer la ligne ${ref_scooter} de la commande ${id_bon} ?`)) return;
    this.bonService.deleteLigne(id_bon, ref_scooter).subscribe({
      next: () => this.reload(),
      error: (err) => console.error(err)
    });
  }

  /** Rafraîchir liste et réinitialiser la sélection (appelé après création/édition) */
  onSaved(): void {
    this.selectedBon = null;
    this.reload();
  }

  printBon(bon: BonCommande): void {
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bon de Commande #${bon.id_bon}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .bon-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { font-weight: bold; text-align: right; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Bon de Commande</h1>
              <p>N°: ${bon.id_bon}</p>
            </div>

            <div class="bon-info">
              <p><strong>Client ID:</strong> ${bon.id_client}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3>Détails de la commande</h3>
            <table>
              <thead>
                <tr>
                  <th>Référence Scooter</th>
                  <th>Quantité</th>
                  <th>Prix Total</th>
                </tr>
              </thead>
              <tbody>
                ${bon.contenirs?.map(ligne => `
                  <tr>
                    <td>${ligne.ref_scooter}</td>
                    <td>${ligne.quantite_cmd}</td>
                    <td>${ligne.total_prix} €</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <p><strong>Total HT:</strong> ${bon.total_ht} €</p>
              <p><strong>TVA:</strong> ${bon.tva} €</p>
              <p class="total"><strong>Total TTC:</strong> ${bon.total_ttc} €</p>
            </div>

            <div class="no-print" style="margin-top: 20px;">
              <button onclick="window.print()">Imprimer</button>
              <button onclick="window.close()">Fermer</button>
            </div>

            <script>
              // Imprimer automatiquement
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  downloadBon(bon: BonCommande): void {
    // Créer le contenu HTML pour le PDF
    const content = `
      <html>
        <head>
          <title>Bon de Commande #${bon.id_bon}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .bon-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bon de Commande</h1>
            <p>N°: ${bon.id_bon}</p>
          </div>

          <div class="bon-info">
            <p><strong>Client ID:</strong> ${bon.id_client}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <h3>Détails de la commande</h3>
          <table>
            <thead>
              <tr>
                <th>Référence Scooter</th>
                <th>Quantité</th>
                <th>Prix Total</th>
              </tr>
            </thead>
            <tbody>
              ${bon.contenirs?.map(ligne => `
                <tr>
                  <td>${ligne.ref_scooter}</td>
                  <td>${ligne.quantite_cmd}</td>
                  <td>${ligne.total_prix} €</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Total HT:</strong> ${bon.total_ht} €</p>
            <p><strong>TVA:</strong> ${bon.tva} €</p>
            <p class="total"><strong>Total TTC:</strong> ${bon.total_ttc} €</p>
          </div>
        </body>
      </html>
    `;

    // Créer un blob avec le contenu HTML
    const blob = new Blob([content], { type: 'text/html' });

    // Créer un lien de téléchargement
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bon-commande-${bon.id_bon}.html`;

    // Déclencher le téléchargement
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Libérer l'URL de l'objet
    URL.revokeObjectURL(a.href);
  }
}
