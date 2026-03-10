import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AtividadeService } from '../../services/atividade.service';
import {
  Atividade, TipoAtividade, StatusAtividade, Prioridade,
  TIPOS, STATUSES, PRIORIDADES, TIPO_LABEL, PRIORIDADE_LABEL, STATUS_LABEL
} from '../../models/atividade.model';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatMenuModule,
    MatSnackBarModule, MatDialogModule, MatTooltipModule
  ],
  templateUrl: './atividades.component.html',
  styleUrl: './atividades.component.scss'
})
export class AtividadesComponent implements OnInit {
  atividades: Atividade[] = [];
  loading = false;
  buscaTexto = '';
  useAI = false;
  filtroTipo?: TipoAtividade;
  filtroStatus?: StatusAtividade;
  filtroPrioridade?: Prioridade;
  viewMode: 'hoje' | 'atrasadas' | 'todas' = 'todas';

  tipos     = TIPOS;
  statuses  = STATUSES;
  prioridades = PRIORIDADES;
  tipoLabel       = TIPO_LABEL;
  prioridadeLabel = PRIORIDADE_LABEL;
  statusLabel     = STATUS_LABEL;

  private buscaSubject = new Subject<string>();

  constructor(
    private service: AtividadeService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarAtividades();
    this.buscaSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(q => {
      if (q.trim()) {
        this.buscar(q);
      } else {
        this.carregarAtividades();
      }
    });
  }

  carregarAtividades() {
    this.loading = true;

    const obs = this.viewMode === 'hoje'      ? this.service.hoje()
              : this.viewMode === 'atrasadas' ? this.service.atrasadas()
              : this.service.listar({
                  tipo: this.filtroTipo,
                  status: this.filtroStatus,
                  prioridade: this.filtroPrioridade
                });

    obs.subscribe({
      next: a => { this.atividades = a; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onBuscaChange(texto: string) {
    this.buscaSubject.next(texto);
  }

  buscar(q: string) {
    this.loading = true;
    this.service.buscar(q, this.useAI).subscribe({
      next: a => { this.atividades = a; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setView(mode: 'hoje' | 'atrasadas' | 'todas') {
    this.viewMode = mode;
    this.buscaTexto = '';
    this.carregarAtividades();
  }

  concluir(atividade: Atividade, event: Event) {
    event.stopPropagation();
    this.service.concluir(atividade.id!).subscribe({
      next: updated => {
        const idx = this.atividades.findIndex(a => a.id === updated.id);
        if (idx >= 0) this.atividades[idx] = updated;
        this.snack.open('Atividade concluida!', 'OK', { duration: 3000, panelClass: 'snack-success' });
      }
    });
  }

  deletar(atividade: Atividade, event: Event) {
    event.stopPropagation();
    if (!confirm(`Deletar "${atividade.titulo}"?`)) return;
    this.service.deletar(atividade.id!).subscribe({
      next: () => {
        this.atividades = this.atividades.filter(a => a.id !== atividade.id);
        this.snack.open('Atividade removida.', 'OK', { duration: 3000 });
      }
    });
  }

  prazoClasse(prazo?: string): string {
    if (!prazo) return '';
    const diff = (new Date(prazo).getTime() - Date.now()) / 86400000;
    if (diff < 0)  return 'prazo-atrasado';
    if (diff <= 1) return 'prazo-urgente';
    if (diff <= 3) return 'prazo-proximo';
    return '';
  }

  prazoTexto(prazo?: string): string {
    if (!prazo) return '';
    const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000);
    if (diff < 0)   return `${Math.abs(diff)}d atrasada`;
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanha';
    return `${diff}d`;
  }
}
