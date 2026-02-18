import { Injectable, computed, signal } from '@angular/core';

const dictionary = {
  es: {
    appTitle: 'Plataforma de Reserva de Catálogo',
    operator: 'Operador', client: 'Cliente',
    roleSelector: 'Selecciona un rol',
    enterAsOperator: 'Entrar como Operador', enterAsClient: 'Entrar como Cliente',
    dashboard: 'Dashboard', catalog: 'Catálogo', myReservations: 'Mis reservas',
    available: 'DISPONIBLE', reserved: 'RESERVADO', queued: 'EN COLA', sold: 'VENDIDO',
    reserve: 'Reservar', joinQueue: 'Entrar en cola', viewDetails: 'Ver detalle',
    markSold: 'Marcar vendido', expireNow: 'Expirar ahora', release: 'Liberar',
    queue: 'Cola', expiresIn: 'Caduca en', demand: 'Demanda',
    sales: 'Ventas (€)', reservations: 'Reservas', pickupTime: 'Tiempo medio',
    topProducts: 'Top productos demandados', recentActivity: 'Actividad reciente',
    demoMode: 'Modo demo', advance6: '+6h', advance24: '+24h',
    expireAll: 'Expirar vencidas', generate: 'Generar actividad', reset: 'Reset demo',
    whatsApp: 'WhatsApp simulado', contact: 'Contactar para recogida',
    day: 'Día', week: 'Semana', month: 'Mes', year: 'Año',
    reserveForClient: 'Reservar para cliente', pickupInstructions: 'Ver instrucciones de recogida'
  },
  en: {
    appTitle: 'Catalog Reservation Platform',
    operator: 'Operator', client: 'Customer',
    roleSelector: 'Select role',
    enterAsOperator: 'Enter as Operator', enterAsClient: 'Enter as Customer',
    dashboard: 'Dashboard', catalog: 'Catalog', myReservations: 'My reservations',
    available: 'AVAILABLE', reserved: 'RESERVED', queued: 'QUEUED', sold: 'SOLD',
    reserve: 'Reserve', joinQueue: 'Join queue', viewDetails: 'View details',
    markSold: 'Mark sold', expireNow: 'Expire now', release: 'Release',
    queue: 'Queue', expiresIn: 'Expires in', demand: 'Demand',
    sales: 'Sales (€)', reservations: 'Reservations', pickupTime: 'Average pickup',
    topProducts: 'Top demanded products', recentActivity: 'Recent activity',
    demoMode: 'Demo mode', advance6: '+6h', advance24: '+24h',
    expireAll: 'Expire overdue', generate: 'Generate activity', reset: 'Reset demo',
    whatsApp: 'Simulated WhatsApp', contact: 'Contact pickup desk',
    day: 'Day', week: 'Week', month: 'Month', year: 'Year',
    reserveForClient: 'Reserve for customer', pickupInstructions: 'View pickup instructions'
  }
} as const;

type Lang = keyof typeof dictionary;

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>('es');
  readonly language = computed(() => this.lang());

  setLanguage(lang: Lang) { this.lang.set(lang); }

  t(key: keyof typeof dictionary.es): string {
    return dictionary[this.lang()][key] ?? key;
  }
}
