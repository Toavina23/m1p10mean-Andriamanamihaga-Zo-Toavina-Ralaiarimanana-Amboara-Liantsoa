import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
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
