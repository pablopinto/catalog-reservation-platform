import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DemoStateService } from '../../core/demo-state.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="cards">
    <article class="card">
      <h2>{{ i18n.t('enterAsOperator') }}</h2>
      <button (click)="go('operator')">{{ i18n.t('operator') }}</button>
    </article>
    <article class="card">
      <h2>{{ i18n.t('enterAsClient') }}</h2>
      <button (click)="go('client')">{{ i18n.t('client') }}</button>
    </article>
  </section>
  `,
  styles: [`.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.card{background:#fff;border:1px solid #aab3c0;border-radius:14px;box-shadow:0 6px 16px rgba(12,20,28,.08);padding:24px}`]
})
export class HomeComponent {
  i18n = inject(I18nService);
  demo = inject(DemoStateService);
  router = inject(Router);
  go(role: 'operator' | 'client') { this.demo.setRole(role); this.router.navigateByUrl(role === 'operator' ? '/operator/dashboard' : '/client/catalog'); }
}
