import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  template: `
    <!-- start navbar -->
    <div class="md:w-full md:sticky flex flex-row flex-wrap justify-between items-center bg-white p-6 border-b">
          
        <!-- logo -->
        <div class="flex-none w-56 flex flex-row items-center">
          <img src="/assets/logo.jpg" class="w-10 flex-none">
          <strong class="capitalize ml-1 flex-1">Beauty salon Employees</strong>
        </div>
        <!-- end logo -->   

        <!-- logout -->
        <a 
          routerLink="/logout"
          class="flex items-center mb-3 capitalize font-medium text-sm cursor-pointer hover:text-teal-600 transition ease-in-out duration-500"
        >
          <fa-icon [icon]="faSignOut" class="text-lg mr-2"></fa-icon>
          Se déconnecter
        </a>
        <!-- end logout -->
        
      </div>
    <!-- end navbar -->
  `,
  styles: ``
})
export class EmployeeNavbarComponent {
  faSignOut = faSignOutAlt
}
