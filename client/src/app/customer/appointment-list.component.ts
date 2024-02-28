import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import {
  AppointmentService,
  UserAppointment,
} from '../services/appointment.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LucideAngularModule } from 'lucide-angular';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailsComponent } from './components/appointment-details.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    LucideAngularModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="mt-6">
      <form
        [formGroup]="filterForm"
        (submit)="getAppointments()"
        class="flex flex-row gap-4 items-center"
      >
        <mat-form-field>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="dateFrom"
            placeholder="Date de début"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <input
            matInput
            [matDatepicker]="picker2"
            formControlName="dateTo"
            placeholder="Date de fin"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker2"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker2></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option [value]="-1"></mat-option>
            <mat-option [value]="0">Nouveau</mat-option>
            <mat-option [value]="1">Terminé</mat-option>
          </mat-select>
        </mat-form-field>
        <button type="submit" class="h-max" mat-raised-button color="primary">
          filtrer
        </button>
        <button
          type="button"
          (click)="onReset()"
          class="h-max"
          mat-raised-button
          color="warn"
        >
          Reinitialiser
        </button>
      </form>
    </div>
    <div class="mt-3">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date du rendez-vous</th>
          <td mat-cell *matCellDef="let element">
            {{ formatDate(element.startDate) }}
          </td>
        </ng-container>
        <ng-container matColumnDef="amountPaid">
          <th mat-header-cell *matHeaderCellDef>Montant payé</th>
          <td mat-cell *matCellDef="let element">{{ element.amountPaid }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status du rendez-vous</th>
          <td mat-cell *matCellDef="let element">
            @if(element.status == 0) {
            <div class="p-3 bg-blue-500 rounded w-min">Nouveau</div>
            } @else {
            <div class="p-3 bg-green-500 rounded w-min">Terminé</div>
            }
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let element">
            <button
              mat-icon-button
              color="primary"
              (click)="openDialog(element._id)"
            >
              <lucide-icon name="eye-icon"></lucide-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
      <mat-paginator
        [pageSize]="5"
        [pageSizeOptions]="[5, 10, 20]"
        showFirstLastButtons
      ></mat-paginator>
    </div>
  `,
  styles: `
  `,
})
export class AppointmentListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getAppointments();
  }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.getAppointments();
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  displayedColumns = ['date', 'amountPaid', 'status', 'actions'];
  error = '';
  subscription: Subscription | undefined;
  dataSource = new MatTableDataSource<UserAppointment>();
  filterForm = this.fb.group({
    dateTo: [null],
    dateFrom: [null],
    status: [-1],
  });

  openDialog(id: string) {
    this.dialog.open(AppointmentDetailsComponent, {
      data: {
        appointmentId: id,
      },
      panelClass: ['w-1/2', 'h-4/5'],
    });
  }

  getAppointments() {
    const filters = {} as {
      dateTo?: Date;
      dateFrom?: Date;
      status?: number;
      pageSize?: number;
      page?: number;
    };
    if (this.dateFrom.getRawValue()) {
      filters.dateFrom = new Date(this.dateFrom.getRawValue());
    }
    if (this.dateTo.getRawValue()) {
      filters.dateTo = new Date(this.dateTo.getRawValue());
    }
    if (this.status.getRawValue() != -1) {
      filters.status = this.status.getRawValue();
    }
    filters.page = (this.paginator ? this.paginator.pageIndex : 0) + 1;
    filters.pageSize = this.paginator ? this.paginator.pageSize : 5;
    this.subscription = this.appointmentService
      .getUserAppointments(filters)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;

          this.paginator.length = response.totalCount;
        },
        error: (error) => {
          this.error = error.message;
        },
      });
  }
  onReset() {
    this.filterForm.reset();
    this.getAppointments();
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  get dateFrom() {
    return this.filterForm.get('dateFrom')!;
  }
  get dateTo() {
    return this.filterForm.get('dateTo')!;
  }
  get status() {
    return this.filterForm.get('status')!;
  }
}
