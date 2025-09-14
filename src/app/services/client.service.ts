import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client{
  id_client?: number;
  nom: string;
  prenom: string;
  phone: string;
  cin: string;
  pays: string;
  ville: string;
  date_naiss: Date;
}
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/client';
  
  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
  
  addClient(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`http://localhost:3000/client/${client.id_client}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/client/${id}`);
  }
}
