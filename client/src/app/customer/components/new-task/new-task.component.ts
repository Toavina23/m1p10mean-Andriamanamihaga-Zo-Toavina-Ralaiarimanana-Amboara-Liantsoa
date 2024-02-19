import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  constructor(public dialogRef: DialogRef<string>, private fb: FormBuilder) {}
  taskForm = this.fb.group({
    service: ['', [Validators.required]],
    employee: ['', [Validators.required]],
  });

  get service() {
    return this.taskForm.get('service');
  }
  get emoloyee() {
    return this.taskForm.get('employee');
  }
}
