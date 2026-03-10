import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade } from '../models/atividade.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  private base = `${environment.apiUrl}/atividades`;

  constructor(private http: HttpClient) {}

  listar(filtros?: { tipo?: string; status?: string; prioridade?: string; materia?: string }): Observable<Atividade[]> {
    let params = new HttpParams();
    if (filtros?.tipo)       params = params.set('tipo', filtros.tipo);
    if (filtros?.status)     params = params.set('status', filtros.status);
    if (filtros?.prioridade) params = params.set('prioridade', filtros.prioridade);
    if (filtros?.materia)    params = params.set('materia', filtros.materia);
    return this.http.get<Atividade[]>(this.base, { params });
  }

  buscarPorId(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.base}/${id}`);
  }

  hoje(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(`${this.base}/hoje`);
  }

  atrasadas(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(`${this.base}/atrasadas`);
  }

  proximas(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(`${this.base}/proximas`);
  }

  buscar(q: string, useAI = false): Observable<Atividade[]> {
    const params = new HttpParams().set('q', q).set('useAI', String(useAI));
    return this.http.get<Atividade[]>(`${this.base}/busca`, { params });
  }

  criar(atividade: Atividade): Observable<Atividade> {
    return this.http.post<Atividade>(this.base, atividade);
  }

  atualizar(id: number, atividade: Atividade): Observable<Atividade> {
    return this.http.put<Atividade>(`${this.base}/${id}`, atividade);
  }

  concluir(id: number): Observable<Atividade> {
    return this.http.patch<Atividade>(`${this.base}/${id}/concluir`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
