import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { OperatorDashboardComponent } from './features/operator/dashboard/operator-dashboard.component';
import { OperatorCatalogComponent } from './features/operator/catalog/operator-catalog.component';
import { OperatorProductDetailComponent } from './features/operator/product-detail/operator-product-detail.component';
import { ClientCatalogComponent } from './features/client/catalog/client-catalog.component';
import { MyReservationsComponent } from './features/client/my-reservations/my-reservations.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'operator/dashboard', component: OperatorDashboardComponent },
  { path: 'operator/catalog', component: OperatorCatalogComponent },
  { path: 'operator/product/:id', component: OperatorProductDetailComponent },
  { path: 'client/catalog', component: ClientCatalogComponent },
  { path: 'client/my-reservations', component: MyReservationsComponent },
  { path: '**', redirectTo: '' }
];
