import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoStateService } from '../../../core/demo-state.service';
import { I18nService } from '../../../core/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="header"><select [ngModel]="demo.currentClientId()" (ngModelChange)="demo.currentClientId.set($event)"><option *ngFor="let c of demo.clients()" [value]="c.id">{{ c.name }}</option></select></section>
  <section class="grid">
    <article *ngFor="let p of products()" class="card">
      <img [src]="p.imageUrl" [alt]="p.name"><div class="id">#{{p.id}}</div><h4>{{p.name}}</h4><p>€ {{p.price}}</p><span>{{p.status}}</span>
      <button *ngIf="p.status==='AVAILABLE'" (click)="demo.reserve(p.id, demo.currentClientId())">{{ i18n.t('reserve') }}</button>
      <button *ngIf="p.status==='RESERVED' || p.status==='QUEUED'" (click)="demo.reserve(p.id, demo.currentClientId())">{{ i18n.t('joinQueue') }}</button>
    </article>
  </section>`,
  styles: [`.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}.card{background:#fff;border:1px solid #a7b2c0;border-radius:12px;padding:10px}img{width:100%;height:120px;object-fit:cover;border-radius:8px}.id{font-weight:700}.header{margin-bottom:8px}button{margin-top:8px;width:100%;padding:7px;border:1px solid #96a4b6;background:#f3f7fd;border-radius:8px}`]
})
export class ClientCatalogComponent {
  demo = inject(DemoStateService);
  i18n = inject(I18nService);
  products = computed(() => this.demo.products());
}
