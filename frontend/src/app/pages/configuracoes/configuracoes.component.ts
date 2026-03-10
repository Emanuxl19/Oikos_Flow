import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigService, Configuracao } from '../../services/config.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss'
})
export class ConfiguracoesComponent implements OnInit {
  config: Configuracao = {};
  loading = false;
  saving = false;
  testando = false;
  mostrarApiKey = false;

  provedores = [
    { value: 'none',   label: 'Desativado' },
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'openai', label: 'OpenAI / DeepSeek / Qwen / Kimi (compativel)' },
    { value: 'gemini', label: 'Gemini (Google)' },
    { value: 'ollama', label: 'Ollama (local — Qwen, Mistral, etc.)' }
  ];

  modelos: Record<string, string[]> = {
    claude: ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001', 'claude-opus-4-6'],
    openai: ['gpt-4o', 'gpt-4o-mini', 'deepseek-chat', 'qwen-plus', 'moonshot-v1-8k'],
    gemini: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
    ollama: ['qwen2.5', 'qwen2.5:14b', 'deepseek-r1', 'mistral', 'llama3.2'],
    none:   []
  };

  constructor(private configService: ConfigService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.carregarConfig();
  }

  carregarConfig() {
    this.loading = true;
    this.configService.getConfig().subscribe({
      next: c => { this.config = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  salvar() {
    this.saving = true;
    this.configService.salvar(this.config).subscribe({
      next: res => {
        this.saving = false;
        this.snack.open(res.mensagem, 'OK', { duration: 3000, panelClass: 'snack-success' });
      },
      error: () => {
        this.saving = false;
        this.snack.open('Erro ao salvar configuracao.', 'OK', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }

  testarTelegram() {
    this.testando = true;
    this.configService.testarTelegram().subscribe({
      next: res => {
        this.testando = false;
        const panelClass = res.sucesso ? 'snack-success' : 'snack-error';
        this.snack.open(res.mensagem, 'OK', { duration: 4000, panelClass });
      },
      error: () => { this.testando = false; }
    });
  }

  get modelosSugeridos(): string[] {
    return this.modelos[this.config.aiProvider || 'none'] || [];
  }

  get mostrarBaseUrl(): boolean {
    return this.config.aiProvider === 'openai';
  }

  get mostrarOllamaUrl(): boolean {
    return this.config.aiProvider === 'ollama';
  }
}
