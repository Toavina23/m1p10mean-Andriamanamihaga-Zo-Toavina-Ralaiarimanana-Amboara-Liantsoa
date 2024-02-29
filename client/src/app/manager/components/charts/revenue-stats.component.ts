import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule
} from "ng-apexcharts";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-revenue-stats',
  standalone: true,
  imports: [
    NgApexchartsModule,
    FontAwesomeModule
  ],
  template: `
    <div class="card">
        <div class="py-3 px-4 flex flex-row justify-between">
            <h1 class="h6 !ml-4 !mt-4">
                <p>Revenues (en Ar)</p>
            </h1>
        </div>                
        <div class="analytics_1">
          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [title]="chartOptions.title"
            [stroke]="{ curve: 'smooth' }"
            [colors]="['#4c51bf']"
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
export class RevenueStatsComponent {
  faWallet = faWallet
  chartOptions: any 

  constructor(
    private http: HttpClient
  ) {
    this.http.get<any[]>(`${environment.serverUrl}/appointments/last`)
          .subscribe((res) => {
            const revenues = this.aggregateRevenuePerMonth(res)
            this.chartOptions = {
              series: [
                  {
                      name: "Revenues (MGA)",
                      data: revenues
                  }
              ],
              chart: {
                  height: 250,
                  type: "area",
              },
              xaxis: {
                  categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
              }
            }
          })
  }

  aggregateRevenuePerMonth(reservations: any[]) {
    const today = new Date()
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    reservations.forEach((reservation) => {
        const bookingDay = new Date(reservation.bookingDate)
        if(today.getFullYear() == bookingDay.getFullYear()) {
            if(bookingDay.getMonth() < 8) data[bookingDay.getMonth()]+= reservation.amountPaid
        }
    })
    return data
  }
}
