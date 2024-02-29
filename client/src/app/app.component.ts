import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule],
  template: ` 
    <router-outlet />
    <div class="w-full fixed bottom-0 text-center">
      <p>&copy; ANDRIAMANAMIHAGA Zo Toavina (1073)</p>
      <p>RALAIARIMANANA Liantsoa Amboara Ny Avo (1150)</p>
    </div>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'client';
}
