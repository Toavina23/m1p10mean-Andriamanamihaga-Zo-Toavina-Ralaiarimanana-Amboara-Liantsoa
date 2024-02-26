import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-appointment-layout',
  standalone: true,
  imports: [RouterModule, MatButtonModule, LucideAngularModule],
  template: `
    <nav class="flex justify-between w-full">
      <div class="flex flex-row items-center gap-2">
        <h1 class="text-2xl">Rendez-vous</h1>
        <lucide-icon name="chevron-right"></lucide-icon>
        <h1 class="text-2xl">{{ actualMenu }}</h1>
      </div>
      <div class="flex gap-6">
        <button mat-stroked-button color="accent" (click)="onMenuChange('')">
          Liste de mes rendez-vous
        </button>
        <button
          mat-stroked-button
          color="accent"
          class=""
          (click)="onMenuChange('new')"
        >
          <div class="flex flex-row gap-2 items-center">
            <lucide-icon name="plus"></lucide-icon>
            <span>Nouveau rendez-vous</span>
          </div>
        </button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: `
  
:host h1 {
    margin: 0
}
  `,
})
export class AppointmentLayoutComponent {
  constructor(private router: Router) {}
  actualMenu:
    | 'Liste de mes rendez-vous'
    | 'Enregistrer un nouveau rendez-vous' = 'Liste de mes rendez-vous';

  onMenuChange(route: string) {
    if (route == 'new') {
      this.actualMenu = 'Enregistrer un nouveau rendez-vous';
    } else {
      this.actualMenu = 'Liste de mes rendez-vous';
    }
    this.router.navigate([`/customer/appointments/${route}`]);
  }
}
