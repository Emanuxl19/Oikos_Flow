import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Configuracao {
  id?: number;
  aiProvider?: string;
  aiApiKey?: string;
  aiModel?: string;
  aiBaseUrl?: string;
  aiOllamaUrl?: string;
  lembretesTelegramAtivos?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private base = `${environment.apiUrl}/configuracao`;

  constructor(private http: HttpClient) {}

  getConfig(): Observable<Configuracao> {
    return this.http.get<Configuracao>(this.base);
  }

  salvar(config: Configuracao): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(this.base, config);
  }

  testarTelegram(): Observable<{ sucesso: boolean; mensagem: string }> {
    return this.http.post<{ sucesso: boolean; mensagem: string }>(
      `${this.base}/testar-telegram`, {}
    );
  }
}
