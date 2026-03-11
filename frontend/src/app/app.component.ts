import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotaService } from './services/nota.service';
import { Nota } from './models/nota.model';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatTooltipModule,
    NotificationToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private static readonly POLL_INTERVAL_MS = 120000;

  lembretes: Nota[] = [];
  quickSearch = '';
  private pollSub?: Subscription;

  navItems = [
    { label: 'Dashboard',      icon: 'dashboard',              route: '/dashboard' },
    { label: 'Atividades',     icon: 'assignment',             route: '/atividades' },
    { label: 'Nova Atividade', icon: 'add_circle_outline',     route: '/atividades/nova' },
    { label: 'Financeiro',     icon: 'account_balance_wallet', route: '/financeiro' },
    { label: 'Configuracoes',  icon: 'settings',               route: '/configuracoes' }
  ];

  constructor(private notaService: NotaService, public auth: AuthService) {}

  ngOnInit() {
    // Polling leve de lembretes (2 min) apenas com sessao ativa.
    this.pollSub = interval(AppComponent.POLL_INTERVAL_MS).pipe(
      switchMap(() => (this.auth.isLoggedIn() ? this.notaService.getLembretesAtivos() : of([])).pipe(
        catchError(() => of([]))
      ))
    ).subscribe(notas => {
      this.lembretes = notas;
    });

    // Verifica imediatamente ao iniciar somente se estiver autenticado.
    if (!this.auth.isLoggedIn()) return;

    this.notaService.getLembretesAtivos().pipe(
      catchError(() => of([]))
    ).subscribe(notas => {
      this.lembretes = notas;
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  get lembreteCount(): number {
    return this.lembretes.length;
  }

  dismissLembrete(nota: Nota) {
    this.lembretes = this.lembretes.filter(n => n.id !== nota.id);
  }
}
