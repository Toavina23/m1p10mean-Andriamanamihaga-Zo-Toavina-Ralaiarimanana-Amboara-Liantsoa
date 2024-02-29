import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartPie, faUsers, faHandshake, faPercent } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule],
  template: `
    <!-- start sidebar -->
    <div id="sideBar" class="flex flex-col flex-wrap bg-white border rounded p-6 flex-none w-64 md:h-[100%]">
        <div class="flex flex-col">
          <p class="uppercase text-xs text-gray-600 mb-4 tracking-wider">Pages</p>
        </div>

        <a 
          routerLink="/manager"
          [ngClass]="{'mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500': true, 'text-teal-600': route == '/manager'}"
        >
          <fa-icon [icon]="faChartPie" class="text-xs mr-2"></fa-icon>
          Dashboard
        </a>
        <a 
          routerLink="/manager/employees"
          [ngClass]="{'mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500': true, 'text-teal-600': employeesRoute.includes(route)}"
        >
          <fa-icon [icon]="faUsers" class="text-xs mr-2"></fa-icon>
          Employés
        </a>
        <a 
          routerLink="/manager/services"
          [ngClass]="{'mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500': true, 'text-teal-600': servicesRoute.includes(route)}"
        >
          <fa-icon [icon]="faHandshake" class="text-xs mr-2"></fa-icon>
          Services
        </a>
        <a 
          routerLink="/manager/offers"
          [ngClass]="{'mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500': true, 'text-teal-600': offersRoute.includes(route)}"
        >
          <fa-icon [icon]="faPercent" class="text-xs mr-2"></fa-icon>
          Offres spéciales
        </a>
        <!-- end link -->
    </div>
    <!-- end sidbar -->
  `,
  styles: ``
})
export class SidebarComponent {
  constructor(
    private router: Router
  ) {}

  faChartPie = faChartPie
  faUsers = faUsers
  faHandshake = faHandshake
  faPercent = faPercent

  employeesRoute = ['/manager/employees/new', '/manager/employees']
  servicesRoute = ['/manager/services/new', '/manager/services']
  offersRoute = ['/manager/offers/new', '/manager/offers']
  
  get route() {
    return this.router.url
  }
}
