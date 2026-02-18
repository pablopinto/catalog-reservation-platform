import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { DemoStateService } from '../../../core/demo-state.service';
import { I18nService } from '../../../core/i18n.service';
import { MetricType, Period } from '../../../models/domain';

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './operator-dashboard.component.html',
  styleUrl: './operator-dashboard.component.css'
})
export class OperatorDashboardComponent {
  demo = inject(DemoStateService);
  i18n = inject(I18nService);
  period = signal<Period>('DAY');
  metric = signal<MetricType>('SALES');

  series = computed(() => this.demo.metricSeries(this.period(), this.metric()));
  max = computed(() => Math.max(...this.series(), 1));

  kpis = computed(() => {
    const events = this.demo.events();
    const sales = events.filter((e) => e.type === 'SOLD').reduce((sum, e) => sum + (e.amount ?? 0), 0);
    const reservations = events.filter((e) => e.type === 'RESERVE').length;
    const sold = events.filter((e) => e.type === 'SOLD').length;
    return [
      { label: this.i18n.t('sales'), value: `€ ${Math.round(sales)}`, var: 8 },
      { label: this.i18n.t('reservations'), value: `${reservations}`, var: 12 },
      { label: this.i18n.t('pickupTime'), value: `${sold ? Math.round(37 + (reservations / sold)) : 0}h`, var: -3 },
      { label: this.i18n.t('topProducts'), value: `${this.demo.topProducts()[0]?.id ?? '-'}`, var: 5 }
    ];
  });
}
