import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Task } from '../../../types';
import {
  AppointmentService,
  NewTask,
} from '../../../services/appointment.service';
@Component({
  selector: 'app-customer-task',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  constructor(private appointmentService: AppointmentService) {}
  @Input() task?: NewTask;

  get taskDate() {
    return this.task?.start.toLocaleDateString();
  }
  get taskTime() {
    return this.task?.start.toLocaleTimeString();
  }

  get employee() {
    return this.task?.employeeFullName;
  }

  get service() {
    return this.appointmentService.getServiceById(this.task?.serviceId!)?.title;
  }
}
