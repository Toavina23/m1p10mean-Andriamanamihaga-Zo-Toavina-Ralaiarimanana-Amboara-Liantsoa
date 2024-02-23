import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Service } from '../../../types';
import {
  AppointmentService,
  EmployeeAvailability,
} from '../../../services/appointment.service';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { services: Service[]; appointmentDate: Date },
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<NewTaskComponent>
  ) {}
  loading = false;
  error = '';
  serviceSubscription: Subscription | null = null;
  employees: EmployeeAvailability[] = [];
  taskForm = this.fb.group({
    service: ['', [Validators.required]],
    employee: ['', [Validators.required]],
  });

  get service() {
    return this.taskForm.get('service');
  }
  get employee() {
    return this.taskForm.get('employee');
  }

  onSubmit() {
    this.appointmentService.addNewTask(
      this.service?.value!,
      this.employees.find(
        (employee) => employee.employeeId == this.employee?.value
      )!,
      this.data.appointmentDate
    );
    this.dialogRef.close();
  }
  onServiceSelected(value: any) {
    if (this.service?.getRawValue() == null) {
      return;
    }
    this.appointmentService
      .getEmployeeAvailability(value, this.data.appointmentDate)
      .subscribe({
        next: (event) => {
          if (event?.type == HttpEventType.Sent) {
            this.loading = true;
          } else if (event?.type == HttpEventType.Response) {
            this.employees = event.body ?? [];
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
  }
  ngOnInit(): void {
    this.serviceSubscription?.unsubscribe();
  }
}
