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
}
