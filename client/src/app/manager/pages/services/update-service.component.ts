import { Component, Input, OnInit } from '@angular/core';
import { FloatingLabelComponent } from '../../components/floating-label.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

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
        <h1 class="text-lg">Mettre à jour le service</h1>
      </div>
      <form (ngSubmit)="onSubmit()" class="p-6 grid grid-cols-6 gap-4">
        <div class="col-span-3">
          <input [(ngModel)]="form.title" name="title" type="text" placeholder="Titre" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input [(ngModel)]="form.description" name="description" type="text" placeholder="Description" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input [(ngModel)]="form.duration" name="duration" type="number" placeholder="Durée (en minute)" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input [(ngModel)]="form.price" name="price" type="number" placeholder="Prix (en Ariary)" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3 relative">
          <select class="w-full bg-white p-3 border rounded">
            <option [value]="null"></option>
            <option *ngFor="let employee of employees" [value]="employee">{{ employee.firstname }} {{ employee.lastname }}</option>
          </select>
          <app-floating-label text="Employés"></app-floating-label>
        </div>
        <div class="col-span-6 mt-6 flex justify-end">
          <button type="submit" [ngClass]="{ 'btn-bs-dark': true, 'opacity-30': loading }" >Enregistrer</button>
        </div>
      </form>
      {{ form.employees }}
    </div>
  `,
  styles: ``
})
export class UpdateServiceComponent {
  @Input() id: string = ''

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ){}

  faArrowLeft = faArrowLeft
  loading = false
  employees: any = []
  selectedEmployee = null

  form: Service = {
    title: '',
    description: '',
    price: null,
    duration: null,
    employees: [],
  }

  ngOnInit() {
    this.http.get<any>(`${environment.serverUrl}/services/${this.id}`)
      .subscribe(res => {
        const { _id, __v, ...serviceDetails } = res
        this.form = serviceDetails
      })

    this.http
      .get(`${environment.serverUrl}/employees`)
      .subscribe(res => {
        this.employees = res
        this.form.employees.push(this.employees[0]._id)
      })

  }

  onSubmit() {
    this.loading = true
    this.http.put(`${environment.serverUrl}/services/${this.id}`, this.form)
        .subscribe({
          next: () => { this.router.navigate(['/manager/services']) },
          error: (err) => { console.log(err) },
          complete: () => { this.loading = false }
        })
  }
}
