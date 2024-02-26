import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-employees',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  template: `
    <div class="w-full bg-white rounded border pb-6">
      <div class="p-6 border-b flex justify-between items-center">
        <h1 class="text-lg">Liste des Employés</h1>
        <button class="btn" routerLink="/manager/employees/new">Nouvel Employé</button>
      </div>
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th class="px-4 py-2 border-r"></th>
            <th class="px-4 py-2 border-r">Nom</th>
            <th class="px-4 py-2 border-r">Prénom</th>
            <th class="px-4 py-2 border-r">Adresse Email</th>
            <th class="px-4 py-2 border-r">Commission</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
          <tbody class="text-gray-600">
            <tr *ngFor="let employee of employees">                    
              <td class="border border-l-0 px-4 py-2 text-center text-green-500"><i class="fad fa-circle"></i></td>
              <td class="border border-l-0 px-4 py-2">{{ employee.lastname }}</td>
              <td class="border border-l-0 px-4 py-2">{{ employee.firstname }}</td>
              <td class="border border-l-0 px-4 py-2">{{ employee.email }}</td>
              <td class="border border-l-0 px-4 py-2 text-right">{{ employee.commission }}%</td>
              <td class="border border-l-0 border-r-0 px-4 py-2 flex justify-center space-x-10">
                <button [routerLink]="['/manager/employees', employee._id]" class="btn-gray">
                  <fa-icon [icon]="updateIcon"></fa-icon>
                </button>
                <button (click)="deleteEmployee(employee._id)" [ngClass]="{ 'btn-danger': true, 'opacity-30': loading == employee._id }">
                  <fa-icon [icon]="deleteIcon"></fa-icon>
                </button>
              </td>
            </tr>
          </tbody>
      </table>
    </div>
  `,
  styles: ``
})
export class ListEmployeesComponent implements OnInit {
  updateIcon = faPencilAlt
  deleteIcon = faTrash
  employees: any = []
  loading = ''

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http
      .get(`${environment.serverUrl}/employees`)
      .subscribe(res => this.employees = res)
  }

  deleteEmployee(id: string) {
    this.loading = id
    this.http
      .delete(`${environment.serverUrl}/employees/${id}`)
      .subscribe(() => { this.employees = this.employees.filter((employee: any) => employee._id != id) })
  }
}
