import { Component, OnInit, ViewChild, signal } from '@angular/core';
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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
      <div class="w-1/3 my-4">
        <h1>Entrez vos informations de payement</h1>
        <div class="flex gap-4">
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput placeholder="name" formControlName="name" />
          </mat-form-field>
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
        </div>
        <mat-form-field class="example-full-width" appearance="fill">
          <input matInput placeholder="Address" formControlName="address" />
        </mat-form-field>
        <mat-form-field class="example-full-width" appearance="fill">
          <input matInput placeholder="ZIP Code" formControlName="zipcode" />
        </mat-form-field>
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
export class PaymentComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  elements!: StripePaymentElementComponent;
  loading = true;
  stripe: StripeServiceInterface = injectStripe(environment.stripePublicKey);
  elementOptions: StripeElementsOptions = {
    locale: 'auto',
  };
  paying = signal(false);
  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {}
  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: ['MB 406 mahabo'],
    zipcode: ['102'],
    city: ['Antananarivo'],
    amount: [2500, [Validators.required, Validators.pattern(/d+/)]],
  });
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
    defaultValues: {},
  };
  ngOnInit() {
    this.paymentService.stripeClientSecret$.subscribe((clientSecret) => {
      if (clientSecret) {
        this.elementOptions = {
          locale: 'auto',
          clientSecret: clientSecret,
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
          alert({ success: false, error: result.error.message });
        } else {
          if (result.paymentIntent.status == 'succeeded') {
            alert(
              `payerrrrrrrr ${result.paymentIntent.amount}: id=${result.paymentIntent.id}`
            );
          }
        }
      });
  }
}
