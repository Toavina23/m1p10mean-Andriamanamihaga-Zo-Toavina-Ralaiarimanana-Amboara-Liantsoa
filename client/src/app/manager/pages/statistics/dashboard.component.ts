import { Component } from '@angular/core';
import { AppointmentsStatsComponent } from '../../components/charts/appointments-stats.component';
import { EmployeeTimeStatsComponent } from '../../components/charts/employee-time-stats.component';
import { RevenueStatsComponent } from '../../components/charts/revenue-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AppointmentsStatsComponent,
    EmployeeTimeStatsComponent,
    RevenueStatsComponent
  ],
  template: `
    <div class="grid grid-cols-6 gap-4">
      <app-employee-time-stats class="col-span-3"></app-employee-time-stats>
      <app-revenue-stats class="col-span-3"></app-revenue-stats>
      <app-appointments-stats class="col-span-6"></app-appointments-stats>
    </div> 
  `,
  styles: ``
})
export class DashboardComponent {

}
