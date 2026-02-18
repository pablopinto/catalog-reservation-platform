import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { DemoStateService } from '../../../core/demo-state.service';
import { I18nService } from '../../../core/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="panel">
    <h3>{{ i18n.t('myReservations') }}</h3>
    <article *ngFor="let p of active()" class="item">
      <strong>#{{ p.id }} {{ p.name }}</strong>
      <span>{{ p.status }}</span>
      <span *ngIf="p.reservedBy===demo.currentClientId()">{{ i18n.t('expiresIn') }}: {{ expiresIn(p.reservedUntil) }}</span>
      <span *ngIf="p.reservedBy!==demo.currentClientId()">{{ i18n.t('queue') }} pos: {{ queuePosition(p) }}</span>
      <button (click)="openWhatsApp(p.id)">{{ i18n.t('contact') }}</button>
      <button>{{ i18n.t('pickupInstructions') }}</button>
    </article>
  </section>
  <section class="panel">
    <h3>Mini métricas</h3>
    <p>Reservas activas: {{ active().length }}</p>
    <p>Compras hechas: {{ purchases() }}</p>
  </section>`,
  styles: [`.panel{background:#fff;border:1px solid #a8b2c0;border-radius:12px;padding:12px;margin-bottom:12px}.item{display:grid;grid-template-columns:1.2fr .6fr .9fr auto auto;gap:8px;border-bottom:1px solid #e4e9f0;padding:8px 0}button{border:1px solid #96a3b5;background:#f5f8fd;border-radius:8px;padding:6px}@media (max-width:900px){.item{grid-template-columns:1fr}}`]
})
export class MyReservationsComponent {
  demo = inject(DemoStateService);
  i18n = inject(I18nService);

  active = computed(() => this.demo.products().filter((p) => p.reservedBy === this.demo.currentClientId() || p.queue.some((q) => q.clientId === this.demo.currentClientId())));
  purchases = computed(() => this.demo.events().filter((e) => e.type === 'SOLD' && e.clientId === this.demo.currentClientId()).length);

  expiresIn(until?: number) { return until ? `${Math.max(0, Math.floor((until - this.demo.demoNow()) / 3600000))}h` : '-'; }
  queuePosition(product: { queue: { clientId: string }[] }) { return product.queue.findIndex((q) => q.clientId === this.demo.currentClientId()) + 1; }
  openWhatsApp(id: string) { alert(`WhatsApp: Hola, coordino recogida para producto ${id}`); }
}
