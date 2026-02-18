import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoStateService } from '../../../core/demo-state.service';
import { I18nService } from '../../../core/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './operator-catalog.component.html',
  styleUrl: './operator-catalog.component.css'
})
export class OperatorCatalogComponent {
  demo = inject(DemoStateService);
  i18n = inject(I18nService);
  q = signal('');
  status = signal('ALL');
  category = signal('ALL');

  categories = computed(() => ['ALL', ...new Set(this.demo.products().map((p) => p.category))]);
  filtered = computed(() => this.demo.products().filter((p) =>
    (!this.q() || p.id.includes(this.q()) || p.name.toLowerCase().includes(this.q().toLowerCase())) &&
    (this.status() === 'ALL' || p.status === this.status()) &&
    (this.category() === 'ALL' || p.category === this.category())
  ));

  expiresIn(productId: string): string {
    const p = this.demo.products().find((x) => x.id === productId);
    if (!p?.reservedUntil) return '-';
    const ms = p.reservedUntil - this.demo.demoNow();
    return `${Math.max(0, Math.floor(ms / 3600000))}h`;
  }

  reserveForRandomClient(productId: string) {
    const client = this.demo.clients()[Math.floor(Math.random() * this.demo.clients().length)];
    this.demo.reserve(productId, client.id);
  }
}
