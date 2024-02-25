import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [],
  template: `
    <!-- start sidebar -->
    <div id="sideBar" class="flex flex-col flex-wrap bg-white border rounded p-6 flex-none w-64 md:h-[100%]">
      <div class="flex flex-col">
        <p class="uppercase text-xs text-gray-600 mb-4 tracking-wider">Pages</p>
      </div>
    </div>
  `,
  styles: ``
})
export class EmployeeSidebarComponent {

}
