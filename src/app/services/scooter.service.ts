import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Scooter {
  ref_scooter: string;
  marque: string;
  modele: string;
  prix: number;
  quantite_stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScooterService {
  private apiUrl = 'http://localhost:3000/scooter';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Scooter[]> {
    return this.http.get<Scooter[]>(this.apiUrl);
  }

  getOne(ref: string): Observable<Scooter> {
    return this.http.get<Scooter>(`${this.apiUrl}/${ref}`);
  }

  create(scooter: Scooter): Observable<Scooter> {
    return this.http.post<Scooter>(this.apiUrl, scooter);
  }

  update(scooter: Scooter): Observable<Scooter> {
    return this.http.put<Scooter>(`${this.apiUrl}/${scooter.ref_scooter}`, scooter);
  }

  delete(ref: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ref}`);
  }
}
