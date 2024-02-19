import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Task } from '../../../types';
@Component({
  selector: 'app-customer-task',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() task?: Task;
  
  get taskDate() {
   return this.task?.start.toLocaleDateString() 
  }
  get taskTime() {
   return this.task?.start.toLocaleTimeString() 
  }
  
  get employee() {
    return `${this.task?.employee.firstname} ${this.task?.employee.lastname}`
  }
}
