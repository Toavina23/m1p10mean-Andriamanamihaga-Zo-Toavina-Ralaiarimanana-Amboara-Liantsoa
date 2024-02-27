import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="border-b p-6">
        <h2 class="!m-0">Gestion d'horaire</h2>
      </div>
      <div class="grid grid-cols-6 gap-4 p-6 border-b">
        <div *ngFor="let day of daysOfWeek" class="flex items-center col-span-5 space-x-2">
          <label class="w-24">{{ day }} :</label>
          <select class="flex-1 p-3 border rounded outline-none">
            <option>...</option>
            <option *ngFor="let hour of hoursOfDay" [value]="hour">{{ hour }}</option>
          </select>
          <select class="flex-1 p-3 border rounded outline-none">
            <option>...</option>
            <option *ngFor="let hour of hoursOfDay" [value]="hour">{{ hour }}</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end p-6">
        <button class="btn-bs-dark">Sauvegarder</button>
      </div>
    </div>
  `,
  styles: ``
})
export class ScheduleFormComponent {
  daysOfWeek = [ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ]
  hoursOfDay = [
    '00:00', '00:30', '01:00', '01:30','02:00','02:30',
    '03:00', '03:30', '04:00', '04:30','05:00','05:30',
    '06:00', '06:30', '07:00', '07:30','08:00','08:30',
    '09:00', '09:30', '10:00', '10:30','11:00','11:30',
    '12:00', '12:30', '13:00', '13:30','14:00','14:30',
    '15:00', '15:30', '16:00', '16:30','17:00','17:30',
    '18:00', '18:30', '19:00', '19:30','20:00','20:30',
    '21:00', '21:30', '22:00', '22:30','23:00','23:30',
  ]
}
