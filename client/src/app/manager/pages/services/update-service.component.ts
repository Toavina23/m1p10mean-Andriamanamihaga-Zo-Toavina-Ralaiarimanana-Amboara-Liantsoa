import { Component, Input, OnInit } from '@angular/core';
import { FloatingLabelComponent } from '../../components/floating-label.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CardEmployeeComponent } from '../../components/card-employee.component';
import { AddEmployeeComponent } from '../../components/add-employee.component';

interface Service {
  title: string| null
  description: string| null
  price: number| null  
  duration: number| null 
  employees: any[]
}

@Component({
  selector: 'app-update-service',
  standalone: true,
  imports: [
    FloatingLabelComponent,
    ReactiveFormsModule,
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
        <h1 class="text-lg">Mettre à jour le service</h1>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 grid grid-cols-6 gap-4">
        <div class="col-span-3">
          <input formControlName="title" name="title" type="text" placeholder="Titre" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="description" name="description" type="text" placeholder="Description" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="duration" name="duration" type="number" placeholder="Durée (en minute)" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="price" name="price" type="number" placeholder="Prix (en Ariary)" class="w-full p-3 border rounded">
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
            <app-card-employee *ngFor="let employee of formEmployeesDetails" [employee]="employee"></app-card-employee>
          </div>
        </div>
        <div class="col-span-6 mt-6 flex justify-end">
          <button type="submit" [ngClass]="{ 'btn-bs-dark': true, 'opacity-30': loading }" >Enregistrer</button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class UpdateServiceComponent {
  @Input() id: string = ''

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ){}

  faArrowLeft = faArrowLeft
  loading = false
  employees: any = []

  form = this.fb.group({
    title: [ null, [Validators.required]],
    description: [ null, [Validators.required]],
    price: [ null, [Validators.required]],
    duration: [ null, [Validators.required]],
    employees: [[]]
  })

  ngOnInit() {
    this.http.get<any>(`${environment.serverUrl}/services/${this.id}`)
      .subscribe(res => {
        const { _id, __v, ...serviceDetails } = res
        this.form.setValue(serviceDetails)
      })

    this.http
      .get(`${environment.serverUrl}/employees`)
      .subscribe(res => {
        this.employees = res
      })

  }

  openDialog() {
    this.dialog.open(AddEmployeeComponent, {
      panelClass: 'w-1/3',
      data: {
        employees: this.employees,
        selectedEmployees: this.formEmployees
      }
    })
  }

  onSubmit() {
    this.loading = true
    this.http.put(`${environment.serverUrl}/services/${this.id}`, this.formValue)
        .subscribe({
          next: () => { this.router.navigate(['/manager/services']) },
          error: (err) => { console.log(err) },
          complete: () => { this.loading = false }
        })
  }

  get formValue() {
    return this.form.value
  }
  get formEmployees(): any[] | null | undefined {
    return this.form.get('employees')?.value
  }
  get formEmployeesDetails() {
    return this.employees.filter((employee: any) => this.formEmployees?.includes(employee._id))
  }
}
