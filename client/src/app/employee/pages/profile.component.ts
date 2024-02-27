import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleFormComponent } from '../components/schedule-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="w-full bg-white rounded border p-6">
      <h1 class="text-xl font-bold">Mon Profil</h1>
      <div *ngIf="employee" class="alert mb-5">
        <p><span class="font-semibold">Nom : </span> {{ employee.lastname }}</p>
        <p><span class="font-semibold">Prénom : </span> {{ employee.firstname }}</p>
        <p><span class="font-semibold">Email : </span> {{ employee.email }}</p>
        <p><span class="font-semibold">Premier jour : </span> {{ startingDay }}</p>
        <p><span class="font-semibold">Commission : </span> {{ employee.commission }}%</p>
      </div>
      <div class="flex justify-between">
        <h2> Horaires : </h2>
        <button (click)="openDialog()" class="btn-gray !border-0">
          Gérer les horaires
        </button>
      </div>
      <div class="grid grid-cols-6 gap-4">
        <div class="col-start-1 col-span-2 alert">
          <span class="font-semibold">Lundi :</span> 08:00 - 17:00
        </div>
        <div class="col-span-2 alert">
          <span class="font-semibold">Mardi :</span> 08:00 - 17:00
        </div>
        <div class="col-start-1 col-span-2 alert">
          <span class="font-semibold">Mercredi :</span> 08:00 - 17:00
        </div>
        <div class="col-span-2 alert">
          <span class="font-semibold">Jeudi :</span> 08:00 - 17:00
        </div>
        <div class="col-start-1 col-span-2 alert">
          <span class="font-semibold">Vendredi :</span> 08:00 - 17:00
        </div>
        <div class="col-span-2 alert">
          <span class="font-semibold">Samedi :</span> 08:00 - 13:00
        </div>
        <div class="col-start-1 col-span-2 alert">
          <span class="font-semibold">Dimanche :</span>
        </div>
        
      </div>
    </div>
  `,
  styles: ``
})
export class ProfileComponent {
  employeeId: string = '65cf0246deadd5d16b5aaa29'
  employee: any = null

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/employees/${this.employeeId}`)
        .subscribe((res) => { this.employee = res })
  }

  openDialog() {
    this.dialog.open(ScheduleFormComponent, {
      panelClass: 'w-1/3'
    })
  }

  get startingDay() {
    return new Date(this.employee?.starting_day).toLocaleDateString('fr-FR')
  }
}
