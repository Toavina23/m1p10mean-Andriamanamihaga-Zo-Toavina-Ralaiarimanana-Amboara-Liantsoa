import { Component } from '@angular/core';
import { FloatingLabelComponent } from '../../components/floating-label.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [
    FloatingLabelComponent, 
    ReactiveFormsModule, 
    FontAwesomeModule, 
    RouterModule,
    CommonModule
  ],
  template: `
    <div class="w-full bg-white rounded border">
      <div class="p-6 border-b flex justify-start items-center space-x-4">
        <button class="btn" routerLink="/manager/employees">
          <fa-icon [icon]="faArrowLeft"></fa-icon>
        </button>
        <h1 class="text-lg">Ajouter un nouvel employé</h1>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 grid grid-cols-6 gap-4">
        <div class="col-span-3">
          <input formControlName="firstname" type="text" placeholder="Nom" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="lastname" type="text" placeholder="Prénom" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-6">
          <input formControlName="email" type="email" placeholder="Adresse e-mail" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="password" type="password" placeholder="Mot de passe" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="password_confirmation" type="password" placeholder="Confirmation du mot de passe" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3 relative">
            <input formControlName="starting_day" type="date" class="w-full p-3 border rounded" placeholder=" " />
            <app-floating-label text="Premier jour"></app-floating-label>
        </div>
        <div class="col-span-3">
          <input formControlName="commission" type="number" placeholder="Pourcentage de commission" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-6 mt-6 flex justify-end">
          <button type="submit" [ngClass]="{ 'btn-bs-dark': true, 'opacity-30': loading }" >Enregistrer</button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class CreateEmployeeComponent {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {}

  form = this.fb.group({
    firstname: [ null, [Validators.required]],
    lastname: [ null, [Validators.required]],
    email: [ null, [Validators.required, Validators.email]],
    password: [ null, [Validators.required, Validators.minLength(8)]],
    password_confirmation: [ null, [Validators.required, Validators.minLength(8)]],
    starting_day: [ null, [Validators.required]],
    commission: [ null, [Validators.required]],
  })
  loading = false
  faArrowLeft = faArrowLeft

  onSubmit() {
    // console.log(this.form.value)
    this.loading = true
    this.http.post(`${environment.serverUrl}/employees`, this.form.value)
        .subscribe({
          next: () => { this.router.navigate(['/manager/employees']) },
          error: (err) => { console.log(err) },
          complete: () => { this.loading = false }
        })
  }
}
