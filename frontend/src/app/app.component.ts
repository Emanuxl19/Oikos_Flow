import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
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
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
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
  lembretes: Nota[] = [];
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
    // Polling de lembretes a cada 30 segundos
    this.pollSub = interval(30000).pipe(
      switchMap(() => this.notaService.getLembretesAtivos().pipe(
        catchError(() => of([]))
      ))
    ).subscribe(notas => {
      this.lembretes = notas;
    });

    // Verifica imediatamente ao iniciar
    this.notaService.getLembretesAtivos().subscribe({
      next: notas => this.lembretes = notas,
      error: () => {}
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
