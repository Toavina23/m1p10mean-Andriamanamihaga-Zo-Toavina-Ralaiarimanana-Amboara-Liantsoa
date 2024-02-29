import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    NgApexchartsModule
} from "ng-apexcharts";
import { CommonModule } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-appointments-stats',
  standalone: true,
  imports: [
    NgApexchartsModule,
    CommonModule,
    MatButtonToggleModule,
    FormsModule
  ],
  template: `
    <div class="card">

      <!-- header -->
      <div class="card-header flex flex-row justify-between">
          <h1 class="h6 !mb-0">Vue d'ensemble des réservations</h1>

          <div class="flex flex-row justify-center items-center">

              <a href="">
                  <i class="fad fa-chevron-double-down mr-6"></i>
              </a>

              <a href="">
                  <i class="fad fa-ellipsis-v"></i>
              </a>

          </div>

      </div>
      <!-- end header -->

      <!-- body -->
      <div class="card-body grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div class="p-8">
            <div *ngIf="chartMode == 'month'">
                <h1 class="h2">{{ currentMonthReservationNumber }}</h1>
                <p class="text-black font-medium">réservations ce mois-ci</p>
            </div>
            <div *ngIf="chartMode == 'day'">
                <h1 class="h2">{{ todayReservationNumber }}</h1>
                <p class="text-black font-medium">réservations aujourd'hui</p>
            </div>

              <div class="mt-20 mb-2">
                <p>Voir les réservations </p>
                <mat-button-toggle-group [(ngModel)]="chartMode" name="fontStyle" aria-label="Font Style">
                    <mat-button-toggle [ngClass]="{'btn !p-0 !rounded-none': true, '!bg-[#81e6d9] !text-[#285e61]': chartMode == 'day'}" value="day">Par jour</mat-button-toggle>
                    <mat-button-toggle [ngClass]="{'btn !p-0 !rounded-none': true, '!bg-[#81e6d9] !text-[#285e61]': chartMode == 'month'}" value="month">Par mois</mat-button-toggle>
                </mat-button-toggle-group>
              </div>

          </div>

          <div *ngIf="chartOptions" class="col-span-2">
            <apx-chart
                [series]="chartOptions[chartMode].series"
                [chart]="chartOptions[chartMode].chart"
                [xaxis]="chartOptions[chartMode].xaxis"
                [title]="chartOptions[chartMode].title"
                [stroke]="{ curve: 'smooth' }"
            ></apx-chart>
          </div>

      </div>
      <!-- end body -->

    </div>
  `,
  styles: `
    .h2 {
      font-size: 3rem;
      font-weight: 800;
    }
  `
})
export class AppointmentsStatsComponent {
    // @ViewChild("chart") chart: ChartComponent
    chartOptions: any 
    reservationPerMonth: any[] = []
    reservationPerDay: any[] = []
    chartMode = 'month'

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.http.get<any[]>(`${environment.serverUrl}/appointments/last`, { headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }})
            .subscribe(res => {
                const { data, categories } = this.aggregateReservationsPerDay(res)
                this.reservationPerDay = data
                this.reservationPerMonth = this.aggregateReservationsPerMonth(res)
                this.chartOptions = {
                    month: {
                        series: [
                            {
                                name: "Réservations",
                                data: this.reservationPerMonth
                            }
                        ],
                        chart: {
                            height: 350,
                            type: "area",
                        },
                        title: {
                            text: "Nombre de réservations par mois"
                        },
                        xaxis: {
                            categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
                        }
                    },
                    day: {
                        series: [
                            {
                                name: "Réservations",
                                data: data
                            }
                        ],
                        chart: {
                            height: 350,
                            type: "area",
                        },
                        title: {
                            text: "Nombre de réservations par jour"
                        },
                        xaxis: {
                            categories: categories
                        }
                    }
                }
            })
    }

    aggregateReservationsPerMonth(reservations: any[]) {
        const today = new Date()
        const data = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        reservations.forEach((reservation) => {
            const bookingDay = new Date(reservation.bookingDate)
            if(today.getFullYear() == bookingDay.getFullYear()) {
                if(bookingDay.getMonth() < 8) data[bookingDay.getMonth()]++
            }
        })
        return data
    }

    aggregateReservationsPerDay(reservations: any[]) {
        const width = 7
        const today = new Date()
        const data = Array.from({ length: width }, () => 0)
        const previousDays = data.map((value, index) => {
            const previousDate = new Date()
            previousDate.setDate(today.getDate() - (width - index -1))
            return previousDate
        })

        reservations.forEach((reservation) => {
            const bookingDay = new Date(reservation.bookingDate)
            const startDiff = bookingDay.getDate() - previousDays[0].getDate()
            const lastDiff = bookingDay.getDate() - previousDays[width-1].getDate()
            if( startDiff >= 0 && lastDiff <= 0) {
                data[startDiff]++
            }
        })
        const categories = previousDays.map((day) => day.toLocaleDateString('fr-FR'))
        return { data, categories }
    }

    get currentMonthReservationNumber() {
        return this.reservationPerMonth[new Date().getMonth()]
    }

    get todayReservationNumber() {
        return this.reservationPerDay.slice(-1)
    }
}
