import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FloatingLabelComponent } from '../../components/floating-label.component';
import { HttpClient } from '@angular/common/http';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update-offer',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    FontAwesomeModule, 
    FloatingLabelComponent
  ],
  template: `
    <div class="w-full bg-white rounded border">
      <div class="p-6 border-b flex justify-start items-center space-x-4">
        <button class="btn" routerLink="/manager/offers">
          <fa-icon [icon]="faArrowLeft"></fa-icon>
        </button>
        <h1 class="text-lg">Ajouter une nouvelle offre spéciale</h1>
      </div>
      <form [formGroup]="form" (submit)="onSubmit()" for class="p-6 grid grid-cols-6 gap-4">
        <div class="col-span-3">
          <input formControlName="code" type="text" placeholder="Code promo" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3">
          <input formControlName="reduction" type="number" placeholder="réduction (en %)" min="0" class="w-full p-3 border rounded">
        </div>
        <div class="col-span-3 relative">
            <input formControlName="endDate" type="date" class="w-full p-3 border rounded"/>
            <app-floating-label text="Fin de validité"></app-floating-label>
        </div>
        <div class="col-span-6 mt-6 flex justify-end">
          <button type="submit" [ngClass]="{ 'btn-bs-dark': true, 'opacity-30': loading }" [disabled]="loading" >Enregistrer</button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class UpdateOfferComponent {
  @Input('id') id: string = ''

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  loading = false
  faArrowLeft = faArrowLeft
  form = this.fb.group({
    code: [null, [Validators.required]],
    reduction: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
  })

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/promotionCodes/id/${this.id}`)
        .subscribe((res: any) => { const {_id, __v, ...offerData} = res; this.form.setValue({...offerData, ['endDate']: offerData.endDate.split('T')[0]}) })
  }

  onSubmit() {
    this.loading = true
    this.http.put(`${environment.serverUrl}/promotionCodes/${this.id}`, this.form.value)
        .subscribe({
          next: () => { this.router.navigate(['/manager/offers']) },
          error: (err) => { console.log(err); this.loading = false },
          complete: () => { this.loading = false }
        })
  }
}
