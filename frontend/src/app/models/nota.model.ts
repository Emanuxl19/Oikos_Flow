export interface Nota {
  id?: number;
  conteudo: string;
  dataLembrete?: string;
  lembreteAtivo: boolean;
  lembreteEnviado?: boolean;
  dataCriacao?: string;
  atividadeId?: number;
  atividadeTitulo?: string;
}
