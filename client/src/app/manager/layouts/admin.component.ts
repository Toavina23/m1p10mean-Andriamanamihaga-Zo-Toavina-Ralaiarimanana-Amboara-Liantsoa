import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar.component';
import { SidebarComponent } from '../components/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <main class="flex flex-col min-h-screen bg-gray-100 font-[Ubuntu]">
      <app-navbar></app-navbar>
      <!-- strat wrapper -->
      <div class="flex-1 flex flex-row flex-wrap p-3">
        <app-sidebar></app-sidebar>
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
export class AdminComponent {

}
