import { Component, Inject, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpEventType } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface Service {
  _id: string;
  title: string;
  duration: number;
}

interface EmployeeId {
  _id: string;
  firstname: string;
  lastname: string;
}

interface Task {
  _id: string;
  startTime: string;
  service: Service;
  employeeId: EmployeeId;
  servicePrice: number;
  employeeComission: number;
  __v: number;
}

interface PromotionCode {
  codeId: string;
  code: string;
  reduction: number;
  _id: string;
}

export interface Appointment {
  _id: string;
  startDate: string;
  tasks: Task[];
  status: number;
  amountPaid: number;
  promotionCode?: PromotionCode; // Making promotionCode optional
}

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [MatTableModule],
  template: `
    <div class="mx-5 mt-6">
      <div>
        <h1 class="text-lg">Informations sur le rendez-vous</h1>
        <table>
          <thead>
            <th></th>
            <th></th>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold">Date du rendez-vous:</td>
              <td>{{ formatDate(appointmentDetails?.startDate!) }}</td>
            </tr>
            <tr>
              <td class="font-bold">Status du rendez-vous:</td>
              <td>
                @if(appointmentDetails?.status == 0) {
                <div class="p-3 bg-blue-500 rounded w-min">Nouveau</div>
                } @else {
                <div class="p-3 bg-green-500 rounded w-min">Terminé</div>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table mat-table [dataSource]="dataSource" class="mt-3">
        <ng-container matColumnDef="startTime">
          <th mat-header-cell *matHeaderCellDef>Début de préstation</th>
          <td mat-cell *matCellDef="let element">
            {{ formatDate(element.startTime) }}
          </td>
        </ng-container>
        <ng-container matColumnDef="employee">
          <th mat-header-cell *matHeaderCellDef>Employé</th>
          <td mat-cell *matCellDef="let element">
            {{ element.employeeId.firstname }} {{ element.employeeId.lastname }}
          </td>
        </ng-container>
        <ng-container matColumnDef="service">
          <th mat-header-cell *matHeaderCellDef>Service</th>
          <td mat-cell *matCellDef="let element">
            {{ element.service.title }}
          </td>
        </ng-container>
        <ng-container matColumnDef="duration">
          <th mat-header-cell *matHeaderCellDef>Durée de prestation</th>
          <td mat-cell *matCellDef="let element">
            {{ element.service.duration }}
          </td>
        </ng-container>
        <ng-container matColumnDef="cost">
          <th mat-header-cell *matHeaderCellDef>Frais de service</th>
          <td mat-cell *matCellDef="let element">
            {{ element.servicePrice }}
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
      <div class="mt-5 flex flex-col w-full items-end">
        @if(appointmentDetails?.promotionCode) {
        <div class="w-1/3 flex justify-between">
          <b>Code de promotion:</b>
          <span>
            {{ appointmentDetails?.promotionCode?.code }} (-{{
              appointmentDetails?.promotionCode?.reduction
            }}
            %)
          </span>
        </div>
        }
        <div class="w-1/3 flex justify-between">
          <b>Total: </b> <span>Ar {{ appointmentDetails?.amountPaid }}</span>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class AppointmentDetailsComponent implements OnInit {
  appointmentDetails: Appointment | undefined;
  error = '';
  loading = false;
  displayedColumns = ['startTime', 'employee', 'service', 'duration', 'cost'];
  dataSource = new MatTableDataSource<Task>();
  constructor(
    private appointmentService: AppointmentService,
    @Inject(MAT_DIALOG_DATA)
    public data: { appointmentId: string }
  ) {}
  ngOnInit(): void {
    this.getAppointmentDetails();
  }

  getAppointmentDetails() {
    this.appointmentService
      .getAppointmentDetails(this.data.appointmentId)
      .subscribe({
        next: (event) => {
          if (event.type == HttpEventType.Sent) {
            this.loading = true;
          } else if (event.type == HttpEventType.Response) {
            this.loading = false;
            if (event.body) {
              this.appointmentDetails = event.body;
              this.dataSource.data = this.appointmentDetails.tasks;
            }
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
