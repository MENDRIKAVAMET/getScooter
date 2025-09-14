import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScooterListComponent } from './components/scooter-list/scooter-list.component';
import { BonCommandeListComponent } from './components/bon-commande-list/bon-commande-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
export const routes: Routes = [
  // 1) Redirection simple et sans guard
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // 2) Page Login (publique)
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
    title: 'Connexion',
  },

  //2.1) Page d'Inscription (publique)
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(m => m.RegisterComponent),
    title: 'Inscription',
  },

  // 3) Dashboard protégé
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    title: 'Dashboard',
  },

  // 4) Liste des clients protégé
  {
    path: 'clients',
    loadComponent: () =>
      import('./components/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [AuthGuard],
    title: 'Clients',
  },

  // 5) Autres routes protégées…
  {
    path: 'scooters',
    loadComponent: () =>
      import('./components/scooter-list/scooter-list.component').then(m => m.ScooterListComponent),
    canActivate: [AuthGuard],
    title: 'Scooters',
  },
  {
    path: 'commandes',
    loadComponent: () =>
      import('./components/bon-commande-list/bon-commande-list.component').then(m => m.BonCommandeListComponent),
    canActivate: [AuthGuard],
    title: 'Commandes',
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard],
    title: 'Utilisateurs',
  },

  // 6) Fallback
  { path: '**', redirectTo: 'login' },
];

