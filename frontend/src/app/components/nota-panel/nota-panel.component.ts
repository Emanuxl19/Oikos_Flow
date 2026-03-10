import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotaService } from '../../services/nota.service';
import { Nota } from '../../models/nota.model';

@Component({
  selector: 'app-nota-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSlideToggleModule, MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './nota-panel.component.html',
  styleUrl: './nota-panel.component.scss'
})
export class NotaPanelComponent implements OnInit {
  @Input() atividadeId!: number;

  notas: Nota[] = [];
  novaNotaConteudo = '';
  novaNotaLembrete?: Date;
  novaNotaLembreteAtivo = false;
  adicionando = false;

  constructor(
    private notaService: NotaService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarNotas();
  }

  carregarNotas() {
    this.notaService.listarPorAtividade(this.atividadeId).subscribe({
      next: notas => this.notas = notas
    });
  }

  adicionarNota() {
    if (!this.novaNotaConteudo.trim()) return;

    const nota: Partial<Nota> = {
      conteudo: this.novaNotaConteudo,
      lembreteAtivo: this.novaNotaLembreteAtivo,
      dataLembrete: this.novaNotaLembrete?.toISOString()
    };

    this.adicionando = true;
    this.notaService.criar(this.atividadeId, nota).subscribe({
      next: n => {
        this.notas.unshift(n);
        this.novaNotaConteudo = '';
        this.novaNotaLembrete = undefined;
        this.novaNotaLembreteAtivo = false;
        this.adicionando = false;
        this.snack.open('Nota adicionada!', '', { duration: 2000, panelClass: 'snack-success' });
      },
      error: () => { this.adicionando = false; }
    });
  }

  toggleLembrete(nota: Nota) {
    nota.lembreteAtivo = !nota.lembreteAtivo;
    if (!nota.lembreteAtivo) nota.lembreteEnviado = false;
    this.notaService.atualizar(nota.id!, nota).subscribe({
      next: updated => {
        const idx = this.notas.findIndex(n => n.id === updated.id);
        if (idx >= 0) this.notas[idx] = updated;
      }
    });
  }

  deletarNota(nota: Nota) {
    if (!confirm('Excluir esta nota?')) return;
    this.notaService.deletar(nota.id!).subscribe({
      next: () => {
        this.notas = this.notas.filter(n => n.id !== nota.id);
        this.snack.open('Nota removida.', '', { duration: 2000 });
      }
    });
  }

  formatarData(data?: string): string {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
