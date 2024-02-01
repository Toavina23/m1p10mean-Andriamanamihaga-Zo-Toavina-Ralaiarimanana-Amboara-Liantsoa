import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

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
        tap((response) => {
          if (response.type == HttpEventType.Response) {
            this.savePayload(response.body!.token, response.body!.username);
          }
        }),
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    let userMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
    } else {
      if (error.status === 401) {
        userMessage = 'Incorrect username or password.';
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
