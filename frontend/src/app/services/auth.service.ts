import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'user_info';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, senha }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(nome: string, email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, { nome, email, senha }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({ nome: res.nome, email: res.email }));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): { nome: string; email: string } | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
