// src/app/components/scooter-list/scooter-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scooter, ScooterService } from '../../services/scooter.service';
import { ScooterFormComponent } from '../scooter-form/scooter-form.component';

@Component({
  selector: 'app-scooter-list',
  standalone: true,
  imports: [CommonModule, ScooterFormComponent],
  templateUrl: './scooter-list.component.html',
  styleUrls: ['./scooter-list.component.css']
})
export class ScooterListComponent implements OnInit {
  scooters: Scooter[] = [];
  selectedScooter: Scooter | null = null;

  constructor(private scooterService: ScooterService) { }

  showForm: boolean = false;

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.selectedScooter = null; // Réinitialiser le formulaire si fermé
    }
  }


  ngOnInit(): void {
    this.fetchScooters();
  }

  fetchScooters(): void {
    this.scooterService.getAll().subscribe({
      next: (data) => (this.scooters = data),
      error: (err) => console.error(err)
    });
  }

  editScooter(scooter: Scooter): void {
    this.selectedScooter = { ...scooter }; // on clone l’objet pour l’édition
  }

  deleteScooter(ref: string): void {
    if (confirm('Supprimer ce scooter ?')) {
      this.scooterService.delete(ref).subscribe({
        next: () => this.fetchScooters(),
        error: (err) => console.error(err)
      });
    }
  }

  onScooterSaved(): void {
    this.fetchScooters();
    this.selectedScooter = null;
  }

}
