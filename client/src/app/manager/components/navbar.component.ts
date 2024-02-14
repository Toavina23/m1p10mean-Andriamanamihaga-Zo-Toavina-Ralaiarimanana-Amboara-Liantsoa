import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <!-- start navbar -->
    <div class="md:w-full md:sticky md:top-0 flex flex-row flex-wrap items-center bg-white p-6 border-b border-gray-300">
          
        <!-- logo -->
        <div class="flex-none w-56 flex flex-row items-center">
          <img src="/assets/logo.jpg" class="w-10 flex-none">
          <strong class="capitalize ml-1 flex-1">Beauty salon Admin</strong>
        </div>
        <!-- end logo -->   
        
      </div>
    <!-- end navbar -->
  `,
  styles: ``
})
export class NavbarComponent {

}
