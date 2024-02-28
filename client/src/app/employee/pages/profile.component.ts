import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleFormComponent } from '../components/schedule-form.component';
import { AuthService } from '../../services/auth.service';

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
      <div *ngIf="employee" class="grid grid-cols-6 gap-4">
        <div *ngFor="let day of daysOfWeek" class="col-start-1 col-span-2 alert">
          <span class="font-semibold mr-2">{{ day }} :</span> 
          {{ schedule[day] ? schedule[day]['startTime'] : '...' }} - {{ schedule[day] ? schedule[day]['endTime'] : '...' }}
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ProfileComponent {
  daysOfWeek = [ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ]
  employee: any = null

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/employees/${this.authService.getUserId()}`)
        .subscribe((res) => { this.employee = res })
  }

  openDialog() {
    this.dialog.open(ScheduleFormComponent, {
      panelClass: 'w-1/3',
      data: {
        employee: this.employee
      }
    })
  }

  get startingDay() {
    return new Date(this.employee?.starting_day).toLocaleDateString('fr-FR')
  }

  get schedule() {
    if(this.employee.schedule) return this.employee.schedule 
    this.employee.schedule = {}
    return this.employee.schedule
  }
}
