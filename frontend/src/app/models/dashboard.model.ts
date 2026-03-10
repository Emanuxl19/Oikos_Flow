import { Atividade } from './atividade.model';

export interface DashboardStats {
  totalAtividades: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
  atrasadas: number;
  hoje: number;
  lembretesPendentes: number;
  porTipo: Record<string, number>;
  porPrioridade: Record<string, number>;
  proximasAtividades: Atividade[];
}
