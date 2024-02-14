import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar.component';
import { SidebarComponent } from '../components/sidebar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent],
  template: `
    <main class="flex flex-col min-h-screen bg-slate-100">
      <app-navbar></app-navbar>
      <!-- strat wrapper -->
      <div class="flex-1 flex flex-row flex-wrap p-3">
        <app-sidebar></app-sidebar>
        <!-- strat content -->
        <div class="bg-gray-100 flex-1 p-6">
          <p>content here</p>
        </div>
        <!-- end content -->
      </div>
    </main>
  `,
  styles: ``
})
export class AdminComponent {

}
