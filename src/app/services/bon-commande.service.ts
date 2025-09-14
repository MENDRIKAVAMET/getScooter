// src/app/services/bon-commande.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contenir {
  ref_scooter: string;
  quantite_cmd: number;
  date_cmd: string;
  remise: number;
  total_prix: number;
}

export interface BonCommande {
  id_bon: number;
  id_client: number;
  total_ht: number;
  tva: number;
  total_ttc: number;
  client?: any;       // optionnel si vous souhaitez afficher l’objet client
  contenirs?: Contenir[];
}

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {
  private apiUrl = 'http://localhost:3000/bon-commande';

  constructor(private http: HttpClient) { }

  // ------- BON COMMANDE CRUD -------

  getAll(): Observable<BonCommande[]> {
    return this.http.get<BonCommande[]>(this.apiUrl);
  }

  getOne(id_bon: number): Observable<BonCommande> {
    return this.http.get<BonCommande>(`${this.apiUrl}/${id_bon}`);
  }

  create(bon: Partial<BonCommande>): Observable<BonCommande> {
    return this.http.post<BonCommande>(this.apiUrl, bon);
  }

  update(id_bon: number, bon: Partial<BonCommande>): Observable<BonCommande> {
    return this.http.put<BonCommande>(`${this.apiUrl}/${id_bon}`, bon);
  }

  delete(id_bon: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_bon}`);
  }

  // ------- CONTENIR (lignes) -------

  getLignes(id_bon: number): Observable<Contenir[]> {
    return this.http.get<Contenir[]>(`${this.apiUrl}/${id_bon}/lignes`);
  }

  updateLigne(
    id_bon: number,
    ref_scooter: string,
    data: Partial<Contenir>
  ): Observable<Contenir> {
    return this.http.put<Contenir>(
      `${this.apiUrl}/${id_bon}/lignes/${ref_scooter}`,
      data
    );
  }

  deleteLigne(id_bon: number, ref_scooter: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id_bon}/lignes/${ref_scooter}`
    );
  }
}
