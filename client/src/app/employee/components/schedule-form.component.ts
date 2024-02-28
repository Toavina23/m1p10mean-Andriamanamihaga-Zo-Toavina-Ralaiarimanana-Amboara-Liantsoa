import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="border-b p-6">
        <h2 class="!m-0">Gestion d'horaire</h2>
      </div>
      <div class="grid grid-cols-6 gap-4 p-6 border-b">
        <div *ngFor="let day of daysOfWeek" class="flex items-center col-span-5 space-x-2">
          <label class="w-24">{{ day }} :</label>
          <select [(ngModel)]="scheduleForm[day]['startTime']" class="flex-1 p-3 border rounded outline-none">
            <option value="">...</option>
            <option *ngFor="let hour of hoursOfDay" [value]="hour">{{ hour }}</option>
          </select>
          <select [(ngModel)]="scheduleForm[day]['endTime']" class="flex-1 p-3 border rounded outline-none">
            <option value="">...</option>
            <option *ngFor="let hour of onlyAfter(scheduleForm[day]['startTime'])" [value]="hour">{{ hour }}</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end p-6">
        <button (click)="onSubmit()" [ngClass]="{ 'btn-bs-dark': true, 'opacity-30': loading }">Sauvegarder</button>
      </div>
    </div>
  `,
  styles: ``
})
export class ScheduleFormComponent {
  daysOfWeek = [ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ]
  hoursOfDay = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { employee: any },
    private dialogRef: MatDialogRef<ScheduleFormComponent>,
    private http: HttpClient
  ) {}

  loading = false
  scheduleForm: any = {
    Lundi: { 
      startTime: this.currentSchedule['Lundi'] ? this.currentSchedule['Lundi']['startTime'] : '', 
      endTime: this.currentSchedule['Lundi'] ? this.currentSchedule['Lundi']['endTime'] : '' 
    },
    Mardi: { 
      startTime: this.currentSchedule['Mardi'] ? this.currentSchedule['Mardi']['startTime'] : '', 
      endTime: this.currentSchedule['Mardi'] ? this.currentSchedule['Mardi']['endTime'] : '' 
    },
    Mercredi: { 
      startTime: this.currentSchedule['Mercredi'] ? this.currentSchedule['Mercredi']['startTime'] : '', 
      endTime: this.currentSchedule['Mercredi'] ? this.currentSchedule['Mercredi']['endTime'] : '' 
    },
    Jeudi: { 
      startTime: this.currentSchedule['Jeudi'] ? this.currentSchedule['Jeudi']['startTime'] : '', 
      endTime: this.currentSchedule['Jeudi'] ? this.currentSchedule['Jeudi']['endTime'] : '' 
    },
    Vendredi: { 
      startTime: this.currentSchedule['Vendredi'] ? this.currentSchedule['Vendredi']['startTime'] : '', 
      endTime: this.currentSchedule['Vendredi'] ? this.currentSchedule['Vendredi']['endTime'] : '' 
    },
    Samedi: { 
      startTime: this.currentSchedule['Samedi'] ? this.currentSchedule['Samedi']['startTime'] : '', 
      endTime: this.currentSchedule['Samedi'] ? this.currentSchedule['Samedi']['endTime'] : '' 
    },
    Dimanche: { 
      startTime: this.currentSchedule['Dimanche'] ? this.currentSchedule['Dimanche']['startTime'] : '', 
      endTime: this.currentSchedule['Dimanche'] ? this.currentSchedule['Dimanche']['endTime'] : '' 
    },
  }
  
  onSubmit() {
    this.loading = true
    const filteredSchedule = this.trimSchedule(this.scheduleForm)
    this.http.post(`${environment.serverUrl}/employees/${this.data.employee._id}/schedule`, filteredSchedule)
        .subscribe({
          next: () => { this.data.employee.schedule = filteredSchedule; this.dialogRef.close() },
          error: (err) => { console.log(err); this.loading = false },
          complete: () => { this.loading = false }
        })
  }
  blankHour(time: string | null) {
    return time == '' || time == null
  }
  trimSchedule(schedule: any) {
    const filteredSchedule: any = {}
    const entries = Object.entries(schedule)
    entries.forEach(([key, daySchedule]: [string, any]) => {
      if(!this.blankHour(daySchedule.startTime) && !this.blankHour(daySchedule.endTime))
        filteredSchedule[key] = daySchedule
    })
    return filteredSchedule
  }
  onlyAfter(time: string) {
    if(this.blankHour(time)) return this.hoursOfDay
    let found = false
    const afterTime = this.hoursOfDay.filter((hour) => {
      if(hour == time) found = true
      return found
    })
    return afterTime
  }

  get currentSchedule() {
    return this.data.employee.schedule
  }
}
