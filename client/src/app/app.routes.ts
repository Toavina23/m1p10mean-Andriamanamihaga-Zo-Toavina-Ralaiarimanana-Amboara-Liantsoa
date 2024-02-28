import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { ManagerComponent } from './manager/layouts/manager.component';
import { BlankComponent } from './manager/layouts/blank.component';
import { AdminComponent } from './manager/layouts/admin.component';
import { AppointmentComponent } from './customer/appointment/appointment.component';
import { PreferencesComponent } from './customer/preferences/preferences.component';
import { CreateEmployeeComponent } from './manager/pages/employees/create-employee.component';
import { ListEmployeesComponent } from './manager/pages/employees/list-employees.component';
import { UpdateEmployeeComponent } from './manager/pages/employees/update-employee.component';
import { CreateServiceComponent } from './manager/pages/services/create-service.component';
import { ListServiceComponent } from './manager/pages/services/list-service.component';
import { UpdateServiceComponent } from './manager/pages/services/update-service.component';
import { EmployeeAdminComponent } from './employee/layouts/employee-admin.component';
import { AppointmentLayoutComponent } from './customer/appointment-layout.component';
import { AppointmentListComponent } from './customer/appointment-list.component';
import { TasksComponent } from './employee/pages/tasks.component';
import { ProfileComponent } from './employee/pages/profile.component';
import { rolesGuard } from './guards/roles.guard';
import { LogoutComponent } from './auth/logout.component';
import { ManagerLoginComponent } from './manager/pages/login/login.component';
import { EmployeeLoginComponent } from './employee/pages/login/login.component';
import { ListOffersComponent } from './manager/pages/offers/list-offers.component';
import { CreateOfferComponent } from './manager/pages/offers/create-offer.component';
import { UpdateOfferComponent } from './manager/pages/offers/update-offer.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'manager/login',
    component: ManagerLoginComponent
  },
  {
    path: 'employee/login',
    component: EmployeeLoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [authGuard, rolesGuard],
    data: { role: 'CLIENT' },
    children: [
      {
        path: '',
        redirectTo: '/customer/appointments',
        pathMatch: 'full',
      },
      {
        path: 'appointments',
        title: 'Vos rendez vous',
        component: AppointmentLayoutComponent,
        children: [
          {
            path: 'new',
            title: 'Nouveau rendez-vous',
            component: AppointmentComponent,
          },
          {
            path: '',
            component: AppointmentListComponent,
          },
        ],
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
    canActivate: [authGuard, rolesGuard],
    data: { role: 'ADMIN' },
    children: [
      {
        path: '',
        component: BlankComponent,
      },
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'employees/new',
            component: CreateEmployeeComponent,
          },
          {
            path: 'employees',
            component: ListEmployeesComponent,
          },
          {
            path: 'employees/:id',
            component: UpdateEmployeeComponent,
          },
          {
            path: 'services/new',
            component: CreateServiceComponent
          },
          {
            path: 'services',
            component: ListServiceComponent
          },
          {
            path: 'services/:id',
            component: UpdateServiceComponent
          },
          {
            path: 'offers/new',
            component: CreateOfferComponent
          },
          {
            path: 'offers',
            component: ListOffersComponent
          },
          {
            path: 'offers/:id',
            component: UpdateOfferComponent
          }
        ]
      }
    ]
  },
  {
    path: 'employee',
    component: EmployeeAdminComponent,
    canActivate: [authGuard, rolesGuard],
    data: { role: 'EMPLOYEE' },
    children: [
      {
        path: '',
        component: TasksComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
    ]
  }
];
