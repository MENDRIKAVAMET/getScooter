// src/app/components/client-list/client-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from '../../services/client.service';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  standalone: true,
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  imports: [
    CommonModule,
    ClientFormComponent,  // pour afficher et gérer le formulaire de client
  ],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  selectedClient: Client | null = null;
  showForm = false;                // contrôle l’affichage du formulaire

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: data => this.clients = data,
      error: err => console.error('Erreur lors de la récupération des clients :', err)
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  editClient(client: Client): void {
    this.selectedClient = { ...client };
    this.showForm = true;
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.fetchClients(),
        error: err => console.error('Erreur lors de la suppression :', err)
      });
    }
  }

  onClientSaved(): void {
    this.fetchClients();
    this.selectedClient = null;
    this.showForm = false;
  }
}
