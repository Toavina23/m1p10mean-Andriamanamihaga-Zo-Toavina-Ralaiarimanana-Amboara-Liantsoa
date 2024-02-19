import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartPie, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  template: `
    <!-- start sidebar -->
    <div id="sideBar" class="flex flex-col flex-wrap bg-white border rounded p-6 flex-none w-64 md:h-[100%]">
        <div class="flex flex-col">
          <p class="uppercase text-xs text-gray-600 mb-4 tracking-wider">Pages</p>
        </div>

        <a href="#" class="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
          <fa-icon [icon]="faChartPie" class="text-xs mr-2"></fa-icon>
          Dashboard
        </a>
        <a 
          routerLink="/manager/employees"
          class="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500"
          [className]="employeesRoute.includes(route) ? 'text-teal-600' : ''"
        >
          <fa-icon [icon]="faUsers" class="text-xs mr-2"></fa-icon>
          Employés
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

  employeesRoute = ['/manager/new-employee', '/manager/employees', '/manager/update-employee']
  
  get route() {
    return this.router.url
  }
}
