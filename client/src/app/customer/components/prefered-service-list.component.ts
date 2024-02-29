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
  selector: 'app-prefered-service-list',
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
          <mat-label>Service</mat-label>
          <mat-select formControlName="service">
            @for (service of services; track $index) {
            <mat-option [value]="service._id">{{ service.title }} </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <p class="text-red-600 font-semibold text-xs">
          @if (service?.invalid && (service?.dirty || service?.touched)) { @if
          (service?.errors?.['required']) { Service requis } }
        </p>
        <button mat-raised-button color="primary">Ajouter</button>
      </form>
      <div class="w-1/3">
        <table mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="service">
            <th mat-header-cell *matHeaderCellDef>Service</th>
            <td mat-cell *matCellDef="let element">{{ element.title }}</td>
          </ng-container>
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>action</th>
            <td mat-cell *matCellDef="let element">
              <button
                mat-icon-button
                color="warn"
                (click)="removePreferedService(element._id)"
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
export class PreferedServiceListComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private preferenceService: PreferencesService
  ) {}
  dataSource = new MatTableDataSource<{ _id: string; title: string }>();
  displayedColumns = ['service', 'action'];
  loading = false;
  error = '';
  form = this.fb.group({
    service: this.fb.control(['', [Validators.required]]),
  });

  ngOnInit(): void {
    this.appointmentService.getAllService();
    this.getPreferedService();
  }

  get service() {
    return this.form.get('service');
  }
  get services() {
    return this.appointmentService.services;
  }
  getPreferedService() {
    this.preferenceService.getPreferedServices().subscribe({
      next: (value) => {
        if (value) {
          this.dataSource.data = value.preferedServices;
        }
      },
    });
  }
  removePreferedService(serviceId: string) {
    this.preferenceService.removeFromPreferedServices(serviceId).subscribe({
      next: (value) => {
        this.getPreferedService();
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
  onSubmit() {
    this.loading = true;
    const serviceId = this.service?.getRawValue();
    this.preferenceService.addServiceToPreference(serviceId).subscribe({
      next: (value) => {
        this.loading = false;
        this.form.reset();
        this.getPreferedService();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message;
      },
    });
  }
}
