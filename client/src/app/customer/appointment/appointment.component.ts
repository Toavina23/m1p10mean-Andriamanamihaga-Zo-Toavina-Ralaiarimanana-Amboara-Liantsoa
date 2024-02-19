import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { validateAppointmentDate } from '../appointment.validaton';
import { LucideAngularModule } from 'lucide-angular';
import { TaskComponent } from '../components/taks/task.component';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Service, Task } from '../../types';
import { NewTaskComponent } from '../components/new-task/new-task.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    TaskComponent,
    DragDropModule,
    DialogModule,
    MatButtonModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css',
})
export class AppointmentComponent {
  constructor(private fb: FormBuilder, public dialog: Dialog) {}
  services: Service[] = [
    {
      title: 'Manucure',
      description: 'Soin des mains',
      duration: 30,
      price: 30000,
    },

    {
      title: 'Pedicure',
      description: 'Soin des pieds',
      duration: 45,
      price: 35000,
    },
  ];
  tasks: Task[] = [
    {
      start: new Date(),
      end: new Date(Date.now() + 30 * 60 * 1000),
      employee: {
        firstname: 'John',
        lastname: 'Doe',
        availability: new Date(),
      },
      service: {
        description: 'Bla bla',
        duration: 45,
        price: 35000,
        title: 'Manucure',
      },
    },
    {
      start: new Date(Date.now() + 30 * 60 * 1000),
      end: new Date(Date.now() + 60 * 60 * 1000),
      employee: {
        firstname: 'Jeanne',
        lastname: 'Doe',
        availability: new Date(),
      },
      service: {
        description: 'Bla bla',
        duration: 45,
        price: 35000,
        title: 'Pédicure',
      },
    },
    {
      start: new Date(Date.now() + 45 * 60 * 1000),
      end: new Date(Date.now() + 60 * 60 * 1000),
      employee: {
        firstname: 'Jeanne',
        lastname: 'Doe',
        availability: new Date(),
      },
      service: {
        description: 'Bla bla',
        duration: 30,
        price: 35000,
        title: 'Pédicure',
      },
    },
  ];

  error: string = '';
  loading: boolean = false;
  appointmentForm = this.fb.group(
    {
      appointmentDate: [
        new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16),
        [Validators.required],
      ],
    },
    { validators: [validateAppointmentDate] }
  );

  openDialog() {
    const dialogRef = this.dialog.open<Task>(NewTaskComponent, {
      panelClass: ['w-1/3', 'h-1/2'],
    });
    dialogRef.closed.subscribe((result) => {
      console.log('Tasks');
    });
  }

  onSubmit() {
    console.log(this.appointmentDate?.getRawValue());
    console.log('submit');
  }

  get appointmentDate() {
    return this.appointmentForm.get('appointmentDate');
  }

  drop(event: CdkDragDrop<Task[]>): void {
    const simulationArray = [...this.tasks];
    moveItemInArray(simulationArray, event.previousIndex, event.currentIndex);
    let taskDate = new Date(this.appointmentDate?.getRawValue());
    let offsetInMinutes = 0;
    simulationArray.forEach((task) => {
      task.start = new Date(taskDate.getTime() + offsetInMinutes * 60 * 1000);
      task.end = new Date(
        task.start.getTime() + task.service.duration * 60 * 1000
      );
      offsetInMinutes += task.service.duration;
    });
    this.tasks = simulationArray;
  }
}
