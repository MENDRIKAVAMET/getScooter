// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// src/app/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) { }

  login(username: string, mdp: string): Observable<void> {
    return this.http.post<{ access_token: string }>(
      'http://localhost:3000/auth/login',
      { username, mdp }
    ).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res.access_token)),
      mapTo(void 0)
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
