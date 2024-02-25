import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-service',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  template: `
    <div class="w-full bg-white rounded border pb-6">
      <div class="p-6 border-b flex justify-between items-center">
        <h1 class="text-lg">Liste des Services</h1>
        <button class="btn" routerLink="/manager/services/new">Nouveau Service</button>
      </div>
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th class="px-4 py-2 border-r"></th>
            <th class="px-4 py-2 border-r">Intitulé</th>
            <th class="px-4 py-2 border-r">Description</th>
            <th class="px-4 py-2 border-r">Durée</th>
            <th class="px-4 py-2 border-r">Prix</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
          <tbody class="text-gray-600">
            <tr *ngFor="let service of services">                    
              <td class="border border-l-0 px-4 py-2 text-center text-green-500"><i class="fad fa-circle"></i></td>
              <td class="border border-l-0 px-4 py-2">{{ service.title }}</td>
              <td class="border border-l-0 px-4 py-2">{{ service.description }}</td>
              <td class="border border-l-0 px-4 py-2">{{ service.duration }}</td>
              <td class="border border-l-0 px-4 py-2 text-right">{{ service.price }}</td>
              <td class="border border-l-0 border-r-0 px-4 py-2 flex justify-center space-x-10">
                <button [routerLink]="['/manager/services', service._id]" class="btn-gray">
                  <fa-icon [icon]="updateIcon"></fa-icon>
                </button>
                <button (click)="deleteService(service._id)" [ngClass]="{ 'btn-danger': true, 'opacity-30': loading == service._id }">
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
export class ListServiceComponent {
  updateIcon = faPencilAlt
  deleteIcon = faTrash
  services: any = []
  loading = ''

  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.http
      .get(`${environment.serverUrl}/services`)
      .subscribe(res => this.services = res)
  }

  deleteService(id: string) {
    this.loading = id
    this.http
      .delete(`${environment.serverUrl}/services/${id}`)
      .subscribe(res => { this.services = this.services.filter((service: any) => service._id != id) })
  }
}
