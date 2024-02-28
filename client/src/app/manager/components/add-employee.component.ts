import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="bg-white rounded border font-[Ubuntu]">
      <div class="p-3 border-b flex justify-start items-center space-x-4">
        <h1 class="text-lg !mb-0">Sélectionner un employé</h1>
      </div>
      <form [formGroup]="form" (submit)="onSubmit()" class="p-6 grid grid-cols-6 gap-4">
        <div class="col-span-6">
          <select formControlName="employee" class="w-full p-3 border rounded outline-none">
            <option></option>
            <option class="p-3" *ngFor="let employee of data.employees" [value]="employee._id">{{ employee.firstname }} {{ employee.lastname }}</option>
          </select>
        </div>
        <div class="col-span-6 mt-3 flex justify-end">
          <button type="submit" [ngClass]="{ 'btn-bs-secondary': true }" >Ajouter</button>
        </div>
      </form>
    </div>
  `,
  styles: `
    select > option {
      padding: 6rem;
    }
  `
})
export class AddEmployeeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { employees: any[], selectedEmployees: any[] },
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private fb: FormBuilder
  ){}

  form = this.fb.group({
    employee: ['', [Validators.required]]
  })

  onSubmit() {
    this.data.selectedEmployees.push(this.employee)
    this.dialogRef.close()
  }

  get employee() {
    return this.form.get('employee')?.value
  }
}
