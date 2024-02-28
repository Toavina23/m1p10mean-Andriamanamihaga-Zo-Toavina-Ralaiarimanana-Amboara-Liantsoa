import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <div class="w-full bg-white rounded border pb-6">
      <div class="p-6 border-b flex justify-between items-center">
        <h1 class="text-lg">Liste des Offres spéciaux</h1>
        <button class="btn" routerLink="/manager/offers/new">Nouvelle Offre</button>
      </div>
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th class="px-4 py-2 border-r"></th>
            <th class="px-4 py-2 border-r">Code</th>
            <th class="px-4 py-2 border-r">Réduction</th>
            <th class="px-4 py-2 border-r">Valide jusqu'au</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600">
          <tr *ngFor="let offer of offers">                    
            <td ngClass="border border-l-0 px-4 py-2 text-center opacity-90"> 
              <fa-icon [ngClass]="isValid(offer) ? 'text-green-500' : 'text-red-500'" [icon]="statusIcon"></fa-icon> 
            </td>
            <td class="border border-l-0 px-4 py-2">{{ offer.code }}</td>
            <td class="border border-l-0 px-4 py-2">{{ offer.reduction }}%</td>
            <td class="border border-l-0 px-4 py-2">{{ localDate(offer.endDate) }}</td>
            <td class="border border-l-0 border-r-0 px-4 py-2 flex justify-center space-x-10">
              <button [routerLink]="['/manager/offers', offer._id]" class="btn-gray">
                <fa-icon [icon]="updateIcon"></fa-icon>
              </button>
              <button (click)="deleteOffer(offer._id)" [ngClass]="{ 'btn-danger': true, 'opacity-30': loading == offer._id }">
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
export class ListOffersComponent {
  updateIcon = faPencilAlt
  deleteIcon = faTrash
  statusIcon = faCircle
  offers: any = []
  loading = ''

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/promotionCodes`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
        .subscribe((res) => { this.offers = res })
  }

  deleteOffer(id: string) {
    this.loading = id
    this.http
      .delete(`${environment.serverUrl}/promotionCodes/${id}`)
      .subscribe(() => { this.offers = this.offers.filter((offer: any) => offer._id != id) })
  }
  isValid(offer: any) {
    const offerEnd = new Date(offer.endDate)
    const today = new Date()
    today.setHours(0, 0, 0)
    return today.getTime() <= offerEnd.getTime()
  }
  localDate(ISOString: string) {
    return new Date(ISOString).toLocaleDateString('fr-FR')
  } 
}
