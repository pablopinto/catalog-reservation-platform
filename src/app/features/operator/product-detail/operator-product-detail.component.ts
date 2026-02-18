import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoStateService } from '../../../core/demo-state.service';
import { I18nService } from '../../../core/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <article class="detail" *ngIf="product() as p">
    <img [src]="p.imageUrl" [alt]="p.name">
    <div>
      <h2>{{ p.name }} (#{{ p.id }})</h2>
      <p>Estado: <span class="badge">{{ p.status }}</span></p>
      <p>Cliente actual: {{ p.reservedBy ?? '-' }}</p>
      <p>48h countdown: {{ countdown() }}</p>
      <h4>{{ i18n.t('queue') }}</h4>
      <ol><li *ngFor="let q of p.queue">{{ q.clientId }}</li></ol>
      <div class="actions">
        <button (click)="demo.markSold(p.id)">{{ i18n.t('markSold') }}</button>
        <button (click)="demo.expireNow(p.id)">{{ i18n.t('expireNow') }}</button>
        <button (click)="demo.release(p.id)">{{ i18n.t('release') }}</button>
        <button (click)="alert('WhatsApp -> '+p.id)">{{ i18n.t('whatsApp') }}</button>
      </div>
    </div>
  </article>`,
  styles: [`.detail{display:grid;grid-template-columns:minmax(260px,420px) 1fr;gap:16px;background:#fff;border:1px solid #aeb8c5;border-radius:12px;padding:12px}.detail img{width:100%;border-radius:10px}.badge{padding:4px 8px;background:#355984;color:#fff;border-radius:999px}.actions{display:flex;gap:8px;flex-wrap:wrap}button{border:1px solid #9aa8ba;background:#f7fafe;padding:6px 10px;border-radius:8px}@media (max-width:900px){.detail{grid-template-columns:1fr}}`]
})
export class OperatorProductDetailComponent {
  demo = inject(DemoStateService);
  i18n = inject(I18nService);
  route = inject(ActivatedRoute);

  product = computed(() => this.demo.products().find((p) => p.id === this.route.snapshot.paramMap.get('id')!));
  countdown = computed(() => {
    const p = this.product();
    if (!p?.reservedUntil) return '-';
    return `${Math.max(0, Math.floor((p.reservedUntil - this.demo.demoNow()) / 3600000))}h`;
  });
}
