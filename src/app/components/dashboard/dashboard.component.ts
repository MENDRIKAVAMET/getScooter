// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { ScooterService } from '../../services/scooter.service';
import { BonCommandeService, BonCommande } from '../../services/bon-commande.service';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
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

  public barChartLabels: string[] = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e0e0e0'
        }
      }
    },
    scales: {
      x: {
        ticks: {color: '#a0a0a0'},
        grid: { color: '#333'}
      },
      y: {
        ticks: { color: '#a0a0a0'},
        grid: { color: '#333'},
        beginAtZero: true,
        max: 10
      }
    }
  };

  public barChartData!: ChartData<'bar'>;

  constructor(
    private clientService: ClientService,
    private scooterService: ScooterService,
    private bonCommandeService: BonCommandeService
  ) { }

  ngOnInit(): void {
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          data: Array(12).fill(0),
          label: `Commandes ${this.currentYear}`,
          backgroundColor: '#2ecc71'
        }
      ]
    }
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
        const countsParMois = Array(12).fill(0);
        commandes.forEach(c => {
          const dateStr = c.contenirs?.[0]?.date_cmd || '';
          const date = new Date(dateStr);
          if(!isNaN(date.getTime())){
            countsParMois[date.getMonth()]++;
          }
        },
        this.totalCommandes = commandes.length
      );
        this.stats = countsParMois;
        if(this.barChartData && this.barChartData.datasets?.[0]) {
          this.barChartData.datasets[0].data = [...this.stats];
        }
        else{
          this.barChartData = {
            labels: this.barChartLabels,
            datasets: [{ data: [...this.stats],
              label: `Commandes ${this.currentYear}`,
              backgroundColor: '#2ecc1'
            }]
          };
        }
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
