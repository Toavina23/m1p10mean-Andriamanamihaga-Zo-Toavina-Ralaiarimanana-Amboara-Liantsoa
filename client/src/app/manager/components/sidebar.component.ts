import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <!-- start sidebar -->
    <div id="sideBar" class="flex flex-col flex-wrap bg-white border rounded border-gray-300 p-6 flex-none w-64 md:h-[100%] md:shadow-xl">
        <div class="flex flex-col">
          <p class="uppercase text-xs text-gray-600 mb-4 tracking-wider">Pages</p>
        </div>

        <a href="#" class="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
          <fa-icon [icon]="faChartPie" class="text-xs mr-2"></fa-icon>
          Dashboard
        </a>
        <!-- end link -->
    </div>
    <!-- end sidbar -->
  `,
  styles: ``
})
export class SidebarComponent {
  faChartPie = faChartPie
}
