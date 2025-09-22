// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { ScooterService } from '../../services/scooter.service';
import { BonCommandeService, BonCommande } from '../../services/bon-commande.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    // ajoute ici d'autres composants standalone nécessaires, ex. ChartComponent
  ],
})
export class DashboardComponent implements OnInit {
  totalClients = 0;
  totalScooters = 0;
  totalCommandes = 0;

  // Pour remplir le mini-graphe (12 mois de l'année)
  stats: number[] = [];

  // Dernières commandes pour l’affichage
  commandesRecentes: BonCommande[] = [];

  currentYear = new Date().getFullYear();

  constructor(
    private clientService: ClientService,
    private scooterService: ScooterService,
    private bonCommandeService: BonCommandeService
  ) { }

  ngOnInit(): void {
    this.chargerStatsClients();
    this.chargerStatsScooters();
    this.chargerStatsCommandes();
    this.chargerCommandesRecentes();
  }

  getMonthName(index: number): string {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[index] || (index + 1).toString();
  }

  get maxValue():number {
    return Math.max(...this.stats, 10);
  }

  get yAxisTicks(): number[] {
    const ticks = [];
    const step = Math.ceil(this.maxValue / 5);
    for(let i = 0; i<=5; i++){
      ticks.push(i * step);
    }
    return ticks;
  }

  private chargerStatsClients(): void {
    this.clientService.getClients().subscribe({
      next: clients => this.totalClients = clients.length,
      error: err => console.error('Erreur en récupérant les clients :', err)
    });
  }

  private chargerStatsScooters(): void {
    this.scooterService.getAll().subscribe({
      next: scooters => this.totalScooters = scooters.length,
      error: err => console.error('Erreur en récupérant les scooters :', err)
    });
  }

  private chargerStatsCommandes(): void {
    this.bonCommandeService.getAll().subscribe({
      next: commandes => {
        this.totalCommandes = commandes.length;

        // Calcule le nombre de commandes par mois
        const countsParMois = Array(12).fill(0);
        commandes.forEach(c => {
          const dateStr = c.contenirs?.[0]?.date_cmd || '';
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            countsParMois[date.getMonth()]++;
          }
        });
        this.stats = countsParMois;
      },
      error: err => console.error('Erreur en récupérant les commandes :', err)
    });
  }

  private chargerCommandesRecentes(): void {
    this.bonCommandeService.getAll().subscribe({
      next: commandes => {
        const triDesc = commandes
          .map(c => ({
            ...c,
            dateCmd: c.contenirs?.[0]?.date_cmd
              ? new Date(c.contenirs[0].date_cmd)
              : new Date(0)
          }))
          .sort((a, b) => b.dateCmd.getTime() - a.dateCmd.getTime());
        this.commandesRecentes = triDesc.slice(0, 5);
      },
      error: err => console.error('Erreur en récupérant les commandes pour la liste :', err)
    });
  }
}
