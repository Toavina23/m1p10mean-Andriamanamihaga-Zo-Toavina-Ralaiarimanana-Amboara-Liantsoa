import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeNavbarComponent } from '../components/employee-navbar.component';
import { EmployeeSidebarComponent } from '../components/employee-sidebar.component';

@Component({
  selector: 'app-employee-admin',
  standalone: true,
  imports: [RouterOutlet, EmployeeNavbarComponent, EmployeeSidebarComponent],
  template: `
    <main class="flex flex-col min-h-screen bg-gray-100 font-[Ubuntu]">
      <app-employee-navbar></app-employee-navbar>
      <!-- strat wrapper -->
      <div class="flex-1 flex flex-row flex-wrap p-3">
        <app-employee-sidebar></app-employee-sidebar>
        <!-- strat content -->
        <div class="bg-gray-100 flex-1 ml-3">
          <router-outlet></router-outlet>
        </div>
        <!-- end content -->
      </div>
    </main>
  `,
  styles: ``
})
export class EmployeeAdminComponent {

}
