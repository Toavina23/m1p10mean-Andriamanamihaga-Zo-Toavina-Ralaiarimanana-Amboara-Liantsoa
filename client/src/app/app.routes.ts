import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth.guard';
import { ManagerComponent } from './manager/layouts/manager.component';
import { BlankComponent } from './manager/layouts/blank.component';
import { AdminComponent } from './manager/layouts/admin.component';
import { CreateEmployeeComponent } from './manager/pages/create-employee.component';
import { ListEmployeesComponent } from './manager/pages/list-employees.component';
import { UpdateEmployeeComponent } from './manager/pages/update-employee.component';
import { AppointmentComponent } from './customer/appointment/appointment.component';
import { PreferencesComponent } from './customer/preferences/preferences.component';

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
    children: [
      {
        path: '',
        redirectTo: '/customer/appointments',
        pathMatch: 'full',
      },
      {
        path: 'appointments',
        title: 'Vos rendez vous',
        component: AppointmentComponent,
      },
      {
        path: 'preferences',
        title: 'Vos préférences',
        component: PreferencesComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'manager',
    component: ManagerComponent,
    children: [
      {
        path: '',
        component: BlankComponent
      },
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'employees/new',
            component: CreateEmployeeComponent
          },
          {
            path: 'employees',
            component: ListEmployeesComponent
          },
          {
            path: 'employees/:id',
            component: UpdateEmployeeComponent
          },
        ]
      }
    ]
  },

];
