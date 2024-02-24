import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient, private router: Router) {}

  public generatePaymentIntent(amount: number) {
    return this.http
      .post<{ secret: string }>(
        `${environment.serverUrl}/payments/paymentIntents`,
        { amount: amount },
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let userMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.log(error);
    } else {
      if (error.status === 400) {
        userMessage = error.error.message;
      } else if (error.status === 401) {
        this.router.navigate(['/login']);
      }
    }
    return throwError(() => new Error(userMessage));
  }
}
