import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FloatingLabelComponent } from '../../components/floating-label.component';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee.component';
import { CardEmployeeComponent } from '../../components/card-employee.component';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [
    FloatingLabelComponent,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule,
    CommonModule,
    MatDialogModule,
    CardEmployeeComponent
  ],
  template: `
    <div class="w-full bg-white rounded border">
      <div class="p-6 border-b flex justify-start items-center space-x-4">
        <button class="btn" routerLink="/manager/services">
          <fa-icon [icon]="faArrowLeft"></fa-icon>
        </button>
        <h1 class="text-lg">Ajouter un nouveau service</h1>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 grid grid-cols-6 gap-4">
        <div class="col-span-3">
          <input formControlName="title" type="text" placeholder="Titre" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="description" type="text" placeholder="Description" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="duration" type="number" placeholder="Durée (en minute)" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="price" type="number" placeholder="Prix (en Ariary)" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <div class="flex items-center space-x-3">
            <div class="pt-3">
                <p class="font-medium m-0">Employés</p>
            </div>
            <button type="button" (click)="openDialog()" class="btn">
                + Ajouter
            </button>
          </div>
          <div class="mt-6">
            <app-card-employee *ngFor="let employee of selectedEmployeesDetails" [employee]="employee"></app-card-employee>
          </div>
        </div>
        <div class="col-span-6 mt-4 flex justify-end">
          <button type="submit" [ngClass]="{ 'btn-bs-dark': true, 'opacity-30': loading }" >Enregistrer</button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class CreateServiceComponent {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ){}

  faArrowLeft = faArrowLeft
  loading = false
  employees: any = []
  selectedEmployees: any[] = []

  form = this.fb.group({
    title: [ null, [Validators.required]],
    description: [ null, [Validators.required]],
    price: [ null, [Validators.required]],
    duration: [ null, [Validators.required]]
  })

  ngOnInit() {
    this.http
      .get(`${environment.serverUrl}/employees`)
      .subscribe(res => this.employees = res)
  }

  openDialog() {
    this.dialog.open(AddEmployeeComponent, {
      panelClass: 'w-1/3',
      data: {
        employees: this.employees,
        selectedEmployees: this.selectedEmployees
      }
    })
  }

  onSubmit() {
    this.loading = true
    console.log({...this.formValue, ['employees']: this.selectedEmployees})
    this.http.post(`${environment.serverUrl}/services`, {...this.formValue, ['employees']: this.selectedEmployees})
        .subscribe({
          next: () => { this.router.navigate(['/manager/services']) },
          error: (err) => { console.log(err) },
          complete: () => { this.loading = false }
        })
  }

  get formValue() {
    return this.form.value
  }

  get selectedEmployeesDetails() {
    return this.employees.filter((employee: any) => this.selectedEmployees.includes(employee._id))
  }
}
