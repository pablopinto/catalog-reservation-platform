import { Injectable, computed, effect, signal } from '@angular/core';
import { Client, DemoEvent, MetricType, Period, Product, ProductStatus, Role } from '../models/domain';

const STORAGE_KEY = 'catalog-demo-state-v1';
const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class DemoStateService {
  readonly role = signal<Role>('operator');
  readonly currentClientId = signal<string>('C001');
  readonly persist = signal<boolean>(true);
  readonly demoNow = signal<number>(Date.now());
  readonly products = signal<Product[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly events = signal<DemoEvent[]>([]);

  readonly topProducts = computed(() => [...this.products()].sort((a, b) => b.demandScore - a.demandScore).slice(0, 10));

  constructor() {
    this.loadOrSeed();
    effect(() => {
      if (this.persist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          role: this.role(), currentClientId: this.currentClientId(), demoNow: this.demoNow(),
          products: this.products(), clients: this.clients(), events: this.events()
        }));
      }
    });
  }

  setRole(role: Role) { this.role.set(role); }

  private loadOrSeed() {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (persisted) {
      const state = JSON.parse(persisted);
      this.role.set(state.role ?? 'operator');
      this.currentClientId.set(state.currentClientId ?? 'C001');
      this.demoNow.set(state.demoNow ?? Date.now());
      this.products.set(state.products ?? []);
      this.clients.set(state.clients ?? []);
      this.events.set(state.events ?? []);
      return;
    }

    const categories = ['Electrónica', 'Hogar', 'Cocina', 'Ferretería', 'Jardín'];
    const names = ['Taladro inalámbrico', 'Monitor 27"', 'Cafetera premium', 'Sierra circular', 'Robot aspirador', 'Batidora industrial'];
    const clients: Client[] = Array.from({ length: 40 }, (_, i) => ({ id: `C${`${i + 1}`.padStart(3, '0')}`, name: `Cliente ${i + 1}`, phone: `+34 600 10${`${i}`.padStart(2, '0')}` }));
    const products: Product[] = Array.from({ length: 60 }, (_, i) => ({
      id: `${i + 1}`.padStart(3, '0'),
      name: `${names[i % names.length]} ${i + 1}`,
      category: categories[i % categories.length],
      price: 55 + (i % 15) * 17,
      imageUrl: `https://picsum.photos/seed/prod${i + 1}/480/320`,
      status: 'AVAILABLE',
      queue: [],
      demandScore: Math.round(Math.random() * 100),
      createdAt: this.demoNow() - Math.round(Math.random() * 40) * DAY_MS
    }));

    this.clients.set(clients);
    this.products.set(products);
    this.events.set([]);
    this.generateActivity(80, 35);
  }

  reserve(productId: string, clientId: string) {
    this.products.update((products) => products.map((p) => {
      if (p.id !== productId) return p;
      if (p.status === 'AVAILABLE') {
        const updated: Product = { ...p, status: 'RESERVED', reservedBy: clientId, reservedAt: this.demoNow(), reservedUntil: this.demoNow() + 48 * 60 * 60 * 1000, demandScore: p.demandScore + 1 };
        this.addEvent('RESERVE', updated.id, clientId, undefined);
        return updated;
      }
      if (p.status === 'RESERVED') {
        const queue = [...p.queue, { clientId, joinedAt: this.demoNow() }];
        this.addEvent('QUEUE_JOIN', p.id, clientId, undefined);
        return { ...p, queue, status: 'QUEUED', demandScore: p.demandScore + 1 };
      }
      return p;
    }));
  }

  markSold(productId: string) {
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;
    this.products.update((products) => products.map((p) => p.id === productId ? { ...p, status: 'SOLD', queue: [] } : p));
    this.addEvent('SOLD', productId, product.reservedBy, product.price);
  }

  release(productId: string) {
    this.products.update((products) => products.map((p) => p.id === productId ? { ...p, status: 'AVAILABLE', reservedBy: undefined, reservedAt: undefined, reservedUntil: undefined, queue: [] } : p));
  }

  expireNow(productId: string) {
    this.products.update((products) => products.map((p) => {
      if (p.id !== productId || (p.status !== 'RESERVED' && p.status !== 'QUEUED')) return p;
      return this.reassignOnExpire(p);
    }));
  }

  advanceHours(hours: number) {
    this.demoNow.update((v) => v + hours * 60 * 60 * 1000);
    this.expireOverdue();
  }

  expireOverdue() {
    this.products.update((products) => products.map((p) => {
      if ((p.status === 'RESERVED' || p.status === 'QUEUED') && p.reservedUntil && p.reservedUntil <= this.demoNow()) {
        return this.reassignOnExpire(p);
      }
      return p;
    }));
  }

  private reassignOnExpire(product: Product): Product {
    this.addEvent('EXPIRE', product.id, product.reservedBy, undefined);
    if (product.queue.length > 0) {
      const next = product.queue[0];
      const tail = product.queue.slice(1);
      return { ...product, status: tail.length ? 'QUEUED' : 'RESERVED', reservedBy: next.clientId, reservedAt: this.demoNow(), reservedUntil: this.demoNow() + 48 * 60 * 60 * 1000, queue: tail };
    }
    return { ...product, status: 'AVAILABLE', reservedBy: undefined, reservedAt: undefined, reservedUntil: undefined, queue: [] };
  }

  generateActivity(reservations = 12, sales = 6) {
    const clientIds = this.clients().map((c) => c.id);
    for (let i = 0; i < reservations; i++) {
      const available = this.products().filter((p) => p.status !== 'SOLD');
      if (!available.length) break;
      const p = available[Math.floor(Math.random() * available.length)];
      const c = clientIds[Math.floor(Math.random() * clientIds.length)];
      this.reserve(p.id, c);
      if (Math.random() > 0.8) this.advanceHours(6);
    }
    for (let i = 0; i < sales; i++) {
      const reserved = this.products().filter((p) => p.status === 'RESERVED' || p.status === 'QUEUED');
      if (!reserved.length) break;
      const p = reserved[Math.floor(Math.random() * reserved.length)];
      this.markSold(p.id);
    }
  }

  resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    this.products.set([]); this.clients.set([]); this.events.set([]); this.demoNow.set(Date.now());
    this.loadOrSeed();
  }

  metricSeries(period: Period, metric: MetricType): number[] {
    const buckets = period === 'DAY' ? 24 : period === 'WEEK' ? 7 : period === 'MONTH' ? 30 : 12;
    const size = period === 'DAY' ? 60 * 60 * 1000 : period === 'WEEK' ? DAY_MS : period === 'MONTH' ? DAY_MS : 30 * DAY_MS;
    const start = this.demoNow() - buckets * size;
    const points = new Array<number>(buckets).fill(0);
    this.events().forEach((event) => {
      if (event.timestamp < start) return;
      const idx = Math.min(buckets - 1, Math.floor((event.timestamp - start) / size));
      if (metric === 'SALES' && event.type === 'SOLD') points[idx] += event.amount ?? 0;
      if (metric === 'RESERVATIONS' && event.type === 'RESERVE') points[idx] += 1;
      if (metric === 'PICKUP_TIME' && event.type === 'SOLD') points[idx] += 14 + (idx % 8);
    });
    return points;
  }

  getStatusLabel(status: ProductStatus) {
    return status;
  }

  private addEvent(type: DemoEvent['type'], productId: string, clientId?: string, amount?: number) {
    const client = this.clients().find((c) => c.id === clientId);
    const messageEs = type === 'RESERVE' ? `Reserva creada: Producto ${productId} por ${client?.name ?? 'N/A'}`
      : type === 'QUEUE_JOIN' ? `Cola: Producto ${productId} +1 cliente`
      : type === 'EXPIRE' ? `Reserva expirada: Producto ${productId}`
      : `Venta confirmada: Producto ${productId}`;
    const messageEn = type === 'RESERVE' ? `Reservation created: Product ${productId} by ${client?.name ?? 'N/A'}`
      : type === 'QUEUE_JOIN' ? `Queue joined: Product ${productId}`
      : type === 'EXPIRE' ? `Reservation expired: Product ${productId}`
      : `Sale confirmed: Product ${productId}`;

    const event: DemoEvent = { id: `${Date.now()}-${Math.random()}`, type, timestamp: this.demoNow(), productId, clientId, amount, messageEs, messageEn };
    this.events.update((events) => [event, ...events].slice(0, 500));
  }
}
