import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumoFinanceiro, Transacao } from '../models/transacao.model';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private readonly API = 'http://localhost:8080/transacoes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.API);
  }

  listarMes(ano: number, mes: number): Observable<Transacao[]> {
    const params = new HttpParams().set('ano', ano).set('mes', mes);
    return this.http.get<Transacao[]>(`${this.API}/mes`, { params });
  }

  resumo(ano: number, mes: number): Observable<ResumoFinanceiro> {
    const params = new HttpParams().set('ano', ano).set('mes', mes);
    return this.http.get<ResumoFinanceiro>(`${this.API}/resumo`, { params });
  }

  criar(t: Transacao): Observable<Transacao> {
    return this.http.post<Transacao>(this.API, t);
  }

  atualizar(id: number, t: Transacao): Observable<Transacao> {
    return this.http.put<Transacao>(`${this.API}/${id}`, t);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
