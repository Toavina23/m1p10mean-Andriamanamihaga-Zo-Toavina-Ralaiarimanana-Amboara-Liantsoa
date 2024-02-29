import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { NgApexchartsModule } from "ng-apexcharts";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-employee-time-stats',
  standalone: true,
  imports: [
    NgApexchartsModule,
    FontAwesomeModule,
    CommonModule
  ],
  template: `
    <div class="card">
        <div class="py-3 px-4 flex flex-row justify-between">
            <h1 class="h6 !ml-4 !mt-4">
                <p>Temps de travail hebdomadaire (en h)</p>
            </h1>
        </div>                
        <div *ngIf="chartOptions" class="analytics_1">
          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [title]="chartOptions.title"
            [stroke]="{ curve: 'smooth' }"
            [colors]="['#4fd1c5']"
            [plotOptions]="{ bar: { horizontal: true } }"
          ></apx-chart>
        </div>
    </div>
  `,
  styles: `
    .h6 {
      font-size: 1.25rem;
      font-weight: 800;
    }

    .h6 > p {
      letter-spacing: 0.05em;
      font-size: 0.875rem;
      --text-opacity: 1;
      color: #a0aec0;
      color: rgba(160, 174, 192, var(--text-opacity));
    }
  `
})
export class EmployeeTimeStatsComponent {
  faClock = faClock
  chartOptions: any 

  constructor(
    private http: HttpClient
  ) {
    this.http.get<any[]>(`${environment.serverUrl}/employees`)
        .subscribe((res) => {
          const meanHours = this.meanHours(res)
          const employeeNames = this.employeeNames(res)
          this.chartOptions = {
            series: [
                {
                    name: "Temps de travail moyen (h)",
                    data: meanHours
                }
            ],
            chart: {
                height: 250,
                type: "bar",
            },
            xaxis: {
                categories: employeeNames
            }
          }
        })
  }

  meanHours(employees: any[]) {
    const diffTime = (start: string, end: string) => { 
      const [ startHours, startMinutes] = start.split(':')
      const [ endHours, endMinutes] = end.split(':')
      const startDate = new Date()
      const endDate = new Date()
      startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0)
      endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0)
      return endDate.getTime() - startDate.getTime()
    }
    const data = employees.map((employee) => {
      const schedule = employee.schedule
      var count = 0
      if(schedule && schedule.Lundi && schedule.Lundi.startTime && schedule.Lundi.endTime) count += diffTime(schedule.Lundi.startTime, schedule.Lundi.endTime)
      if(schedule && schedule.Mardi && schedule.Mardi.startTime && schedule.Mardi.endTime) count += diffTime(schedule.Mardi.startTime, schedule.Mardi.endTime)
      if(schedule && schedule.Mercredi && schedule.Mercredi.startTime && schedule.Mercredi.endTime) count += diffTime(schedule.Mercredi.startTime, schedule.Mercredi.endTime)
      if(schedule && schedule.Jeudi && schedule.Jeudi.startTime && schedule.Jeudi.endTime) count += diffTime(schedule.Jeudi.startTime, schedule.Jeudi.endTime)
      if(schedule && schedule.Vendredi && schedule.Vendredi.startTime && schedule.Vendredi.endTime) count += diffTime(schedule.Vendredi.startTime, schedule.Vendredi.endTime)
      if(schedule && schedule.Samedi && schedule.Samedi.startTime && schedule.Samedi.endTime) count += diffTime(schedule.Samedi.startTime, schedule.Samedi.endTime)
      if(schedule && schedule.Dimanche && schedule.Dimanche.startTime && schedule.Dimanche.endTime) count += diffTime(schedule.Dimanche.startTime, schedule.Dimanche.endTime)
      return count / 3_600_000
    })
    return data
  }
  employeeNames(employees: any[]) {
    const fullNames = employees.map((employee) => `${employee.firstname}  ${employee.lastname}`)
    return fullNames
  }
}
