import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

type AuthenticationPayload = {
  username: string;
  token: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  clientAuthPayload: AuthenticationPayload | null = null;
  authenticate(email: string, password: string) {
    return this.http
      .post<AuthenticationPayload>(
        `${environment.serverUrl}/auth/login`,
        {
          email: email,
          password: password
        },
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          if (event.type == HttpEventType.Response) {
            this.savePayload(event.body!.token, event.body!.username, event.body!.role);
          }
        }),
        catchError(this.handleError)
      );
  }
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
            this.savePayload(event.body!.token, event.body!.username, event.body!.role);
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
            this.savePayload(event.body!.token, event.body!.username, event.body!.role);
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
        console.log(error.error);
        userMessage = error.error.message;
      }
    }
    return throwError(() => new Error(userMessage));
  }

  private savePayload(token: string, username: string, role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT') {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  }

  logout() {
    localStorage.clear()
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getUserRole() {
    try {
      const decodedToken = this.decodeAuthToken();
      return decodedToken.role;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  customerSessionValid() {
    return !this.tokenExpired();
  }
  private decodeAuthToken() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('no auth token');
      }
      const decodedToken = jwtDecode(token) as {
        userId: string;
        email: string;
        role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
        exp: number;
      };
      return decodedToken;
    } catch (err) {
      throw err;
    }
  }
  private tokenExpired() {
    try {
      const decodedToken = this.decodeAuthToken();
      return decodedToken.exp <= new Date().getTime() / 1000;
    } catch (err) {
      console.log(err);
      return true;
    }
  }
  public getUserId() {
    try {
      const decodedToken = this.decodeAuthToken();
      return decodedToken.userId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
