import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskCardComponent } from '../components/task-card.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    TaskCardComponent
  ],
  template: `
    <div class="card flex flex-col">
      <h1 class="p-6 border-b">
        Vos tâches assignés
      </h1>
      <div class="flex-1 flex flex-col">
        <app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
      </div>
    </div>
  `,
  styles: ``
})
export class TasksComponent {
  employeeId: string = '65cf0246deadd5d16b5aaa29'
  tasks: any = []
  updateIcon = faPencilAlt

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/tasks/employees/${this.employeeId}`)
        .subscribe((res) => { this.tasks = res })
  }

  dateString(date: Date) {
    return date.toLocaleDateString('fr-FR')
  }
}
