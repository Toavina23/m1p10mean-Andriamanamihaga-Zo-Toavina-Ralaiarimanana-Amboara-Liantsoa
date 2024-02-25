import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FloatingLabelComponent } from '../../components/floating-label.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [
    FloatingLabelComponent,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule,
    CommonModule
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
        <div class="col-span-3 relative">
          <select [ngModel]="selectedEmployee" class="w-full bg-white p-3 border rounded">
            <option [value]="null"></option>
            <option *ngFor="let employee of employees" [value]="employee">{{ employee.firstname }} {{ employee.lastname }}</option>
          </select>
          <app-floating-label text="Employés"></app-floating-label>
        </div>
        <div class="col-span-6 mt-6 flex justify-end">
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
    private router: Router
  ){}

  faArrowLeft = faArrowLeft
  loading = false
  employees: any = []
  selectedEmployee = null

  form = this.fb.group({
    title: [ null, [Validators.required]],
    description: [ null, [Validators.required]],
    price: [ null, [Validators.required]],
    duration: [ null, [Validators.required]],
    employees: [ [] ],
  })

  ngOnInit() {
    this.http
      .get(`${environment.serverUrl}/employees`)
      .subscribe(res => this.employees = res)
  }

  onSubmit() {
    this.loading = true
    this.http.post(`${environment.serverUrl}/services`, this.form.value)
        .subscribe({
          next: () => { this.router.navigate(['/manager/services']) },
          error: (err) => { console.log(err) },
          complete: () => { this.loading = false }
        })
  }
}
