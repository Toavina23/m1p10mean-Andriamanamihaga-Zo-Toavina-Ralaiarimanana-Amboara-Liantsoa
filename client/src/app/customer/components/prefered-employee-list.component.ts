import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AppointmentService } from '../../services/appointment.service';
import { MatSelectModule } from '@angular/material/select';
import { PreferencesService } from '../../services/preferences.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-prefered-employee-list',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    LucideAngularModule,
  ],
  template: `
    @if (error != '') {
    <p class="text-red-600 font-semibold text-xs">{{ error }}</p>
    }
    <div class="my-5">
      <form
        (submit)="onSubmit()"
        [formGroup]="form"
        class="w-1/3 my-3 flex  gap-4 items-center"
      >
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Employé</mat-label>
          <mat-select formControlName="employee">
            @for (employee of employees; track $index) {
            <mat-option [value]="employee._id"
              >{{ employee.firstname }} {{ employee.lastname }}
            </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <p class="text-red-600 font-semibold text-xs">
          @if (employee?.invalid && (employee?.dirty || employee?.touched)) {
          @if (employee?.errors?.['required']) { Employé requis } }
        </p>
        <button mat-raised-button color="primary">Ajouter</button>
      </form>
      <div class="w-1/3">
        <table mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="service">
            <th mat-header-cell *matHeaderCellDef>Employé</th>
            <td mat-cell *matCellDef="let element">
              {{ element.firstname }} {{ element.lastname }}
            </td>
          </ng-container>
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>action</th>
            <td mat-cell *matCellDef="let element">
              <button
                mat-icon-button
                color="warn"
                (click)="removeFromPreferedEmployee(element._id)"
              >
                <lucide-icon name="trash"></lucide-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: ``,
})
export class PreferedEmployeeListComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private preferenceService: PreferencesService
  ) {}
  dataSource = new MatTableDataSource<{
    _id: string;
    firstname: string;
    lastname: string;
  }>();
  displayedColumns = ['service', 'action'];
  employees: { _id: string; firstname: string; lastname: string }[] = [];
  loading = false;
  error = '';
  form = this.fb.group({
    employee: this.fb.control(['', [Validators.required]]),
  });
  ngOnInit(): void {
    this.preferenceService.getEmployeeList().subscribe({
      next: (value) => {
        if (value) {
          this.employees = value;
        }
      },
      error: (error) => {
        this.error = error.message;
      },
    });
    this.getPreferedEmployees();
  }
  get employee() {
    return this.form.get('employee');
  }
  getPreferedEmployees() {
    this.preferenceService.getPreferedEmployees().subscribe({
      next: (value) => {
        this.dataSource.data = value.preferedEmployees;
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
  removeFromPreferedEmployee(employeeId: string) {
    this.preferenceService.removeFromPreferedEmployees(employeeId).subscribe({
      next: (value) => {
        this.getPreferedEmployees();
      },

      error: (error) => {
        this.error = error.message;
      },
    });
  }
  onSubmit() {
    this.loading = true;
    this.preferenceService
      .addEmployeeToPreference(this.employee?.getRawValue())
      .subscribe({
        next: (value) => {
          this.loading = true;
          this.form.reset();
          this.getPreferedEmployees();
        },
        error: (error) => {
          this.error = error.message;
        },
      });
  }
}
