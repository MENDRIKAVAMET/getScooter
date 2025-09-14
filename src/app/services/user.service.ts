// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDto } from '../models/register.dto';

export interface User {
  id: number;
  username: string;
  mdp?: string; // le backend renvoie le hash, mais on ne l’affichera pas
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  // Récupère tous les users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Récupère un seul user par ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Crée un nouvel utilisateur
  createUser(data: { username: string; mdp: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  // Met à jour un utilisateur existant
  updateUser(id: number, data: { username: string; mdp?: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  // Supprime un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
