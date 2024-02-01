import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
