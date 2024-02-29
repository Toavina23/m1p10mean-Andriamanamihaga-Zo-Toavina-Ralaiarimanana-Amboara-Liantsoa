import { Component } from '@angular/core';
import { AppointmentsStatsComponent } from '../../components/charts/appointments-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppointmentsStatsComponent],
  template: `
    <div class="flex-1">
      <app-appointments-stats></app-appointments-stats>
    </div> 
  `,
  styles: ``
})
export class DashboardComponent {

}
