import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../models/nota.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarPorAtividade(atividadeId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.base}/atividades/${atividadeId}/notas`);
  }

  criar(atividadeId: number, nota: Partial<Nota>): Observable<Nota> {
    return this.http.post<Nota>(`${this.base}/atividades/${atividadeId}/notas`, nota);
  }

  atualizar(id: number, nota: Partial<Nota>): Observable<Nota> {
    return this.http.put<Nota>(`${this.base}/notas/${id}`, nota);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/notas/${id}`);
  }

  getLembretesAtivos(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.base}/notas/lembretes`);
  }
}
