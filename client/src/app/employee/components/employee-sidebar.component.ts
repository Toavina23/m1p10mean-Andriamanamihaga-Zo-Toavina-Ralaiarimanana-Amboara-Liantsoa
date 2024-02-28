import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTasks, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  template: `
    <!-- start sidebar -->
    <div id="sideBar" class="flex flex-col flex-wrap bg-white border rounded p-6 flex-none w-64 md:h-[100%]">
      <div class="flex flex-col">
        <p class="uppercase text-xs text-gray-600 mb-4 tracking-wider">Pages</p>
      </div>
      <a 
          routerLink="/employee"
          [ngClass]="{'mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500': true, 'text-teal-600': route == '/employee'}"
        >
        <fa-icon [icon]="faTasks" class="text-xs mr-2"></fa-icon>
        Mes tâches
      </a>
      <a 
          routerLink="/employee/profile"
          [ngClass]="{'mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500': true, 'text-teal-600': route == '/employee/profile'}"
        >
        <fa-icon [icon]="faUser" class="text-xs mr-2"></fa-icon>
        Mon profil
      </a>
    </div>
  `,
  styles: ``
})
export class EmployeeSidebarComponent {
  constructor(private router: Router) {}

  faTasks = faTasks
  faUser = faUser

  get route() {
    return this.router.url
  }
}
