import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';

type AuthenticationPayload = {
  username: string;
  token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  clientAuthPayload: AuthenticationPayload | null = null;
  authenticateClient(email: string, password: string) {
    return this.http
      .post<AuthenticationPayload>(
        `${environment.serverUrl}/auth/login`,
        {
          email: email,
          password: password,
          role: 'CLIENT',
        },
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          if (event.type == HttpEventType.Response) {
            this.savePayload(event.body!.token, event.body!.username);
          }
        }),
        catchError(this.handleError)
      );
  }
  registerClient(
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) {
    return this.http
      .post<{ userId: string }>(
        `${environment.serverUrl}/auth/register`,
        {
          email: email,
          password: password,
          firstname: firstname,
          lastname: lastname,
          role: 'CLIENT',
        },
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(catchError(this.handleError));
  }
  verifyUserEmail(code: string, userId: string) {
    return this.http
      .post<AuthenticationPayload>(
        `${environment.serverUrl}/auth/confirmEmail`,
        {
          code: code,
          userId: userId,
        },
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          if (event.type == HttpEventType.Response) {
            this.savePayload(event.body!.token, event.body!.username);
          }
        }),
        catchError(this.handleError)
      );
  }
  resendValidationCode(userId: string) {
    return this.http
      .post(
        `${environment.serverUrl}/auth/resendCode`,
        { userId: userId },
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let userMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.log(error);
    } else {
      if (error.status === 400 || error.status === 401) {
        console.log('mandalo ato');
        console.log(error.error);
        userMessage = error.error.message;
      }
    }
    return throwError(() => new Error(userMessage));
  }

  private savePayload(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }
  getToken() {
    return localStorage.getItem('token');
  }
}
