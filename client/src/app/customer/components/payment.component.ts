import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import {
  StripeElementsDirective,
  StripePaymentElementComponent,
  StripeServiceInterface,
  injectStripe,
} from 'ngx-stripe';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environments/environment';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-appointment-payment',
  standalone: true,
  imports: [
    StripeElementsDirective,
    StripePaymentElementComponent,
    MatButtonModule,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <form (submit)="processPayment()" [formGroup]="paymentElementForm">
      <div class="w-2/5 my-4">
        <h2>Entrez vos informations de payement</h2>
        <div class="flex gap-4">
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput placeholder="name" formControlName="name" />
          </mat-form-field>
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
        </div>
        <div class="flex gap-4">
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput placeholder="Address" formControlName="address" />
          </mat-form-field>
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput placeholder="ZIP Code" formControlName="zipcode" />
          </mat-form-field>
        </div>
        <mat-form-field class="example-full-width" appearance="fill">
          <input matInput placeholder="city" formControlName="city" />
        </mat-form-field>
        @if(!loading) {
        <ngx-stripe-elements
          [stripe]="stripe"
          [elementsOptions]="elementOptions"
        >
          <ngx-stripe-payment [options]="paymentElementOptions" />
        </ngx-stripe-elements>
        } @else {
        <p>Loading....</p>
        }
      </div>
      <button
        type="submit"
        mat-raised-button
        color="primary"
        [disabled]="paying()"
      >
        Payer
      </button>
    </form>
  `,
  styles: ``,
})
export class PaymentComponent implements OnChanges {
  @ViewChild(StripePaymentElementComponent)
  elements!: StripePaymentElementComponent;
  @Output() paymentId = new EventEmitter<string>();
  @Input() paymentElementForm!: FormGroup;
  loading = true;
  stripe: StripeServiceInterface = injectStripe(environment.stripePublicKey);
  elementOptions: StripeElementsOptions = {
    locale: 'auto',
  };
  paying = signal(false);
  constructor(private paymentService: PaymentService) {}
  @Input() amount: number | undefined;
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
    defaultValues: {},
  };
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['amount'] || this.amount == 0) {
      return;
    }
    this.paymentService
      .generatePaymentIntent(this.amount!)
      .subscribe((result) => {
        if (result) {
          this.elementOptions = {
            locale: 'auto',
            clientSecret: result.secret,
          };
          this.loading = false;
        }
      });
  }
  processPayment() {
    if (this.paying()) return;
    this.paying.set(true);
    const { name, email, address, zipcode, city } =
      this.paymentElementForm.getRawValue();
    this.stripe
      .confirmPayment({
        elements: this.elements.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string,
              },
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe((result) => {
        this.paying.set(false);
        if (result.error) {
          console.log(result.error);
          alert('Le payement a échouer');
        } else {
          if (result.paymentIntent.status == 'succeeded') {
            console.log(
              `payerrrrrrrr ${result.paymentIntent.amount}: id=${result.paymentIntent.id}`
            );
            this.paymentId.emit(result.paymentIntent.id);
          }
        }
      });
  }
}
