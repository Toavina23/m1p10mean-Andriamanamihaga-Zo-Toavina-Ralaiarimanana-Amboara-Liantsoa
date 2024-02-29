import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [LucideAngularModule, RouterModule, MatButtonModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
})
export class PreferencesComponent {
  constructor(private router: Router) {}
  actualMenu: 'Mes employés préférés' | 'Mes services préférés' =
    'Mes services préférés';

  onMenuChange(route: string) {
    if (route == 'employees') {
      this.actualMenu = 'Mes employés préférés';
    } else {
      this.actualMenu = 'Mes services préférés';
    }
    this.router.navigate([`/customer/preferences/${route}`]);
  }
}
