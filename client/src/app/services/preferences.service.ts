import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  constructor(private router: Router, private http: HttpClient) {}
  addServiceToPreference(serviceId: string) {
    return this.http
      .post(`${environment.serverUrl}/preferences/services`, {
        serviceId: serviceId,
      })
      .pipe(catchError(this.handleError));
  }

  getPreferedServices() {
    return this.http
      .get<{ preferedServices: { _id: string; title: string }[] }>(
        `${environment.serverUrl}/preferences/services`
      )
      .pipe(catchError(this.handleError));
  }

  removeFromPreferedServices(serviceId: string) {
    return this.http
      .delete(`${environment.serverUrl}/preferences/services`, {
        body: {
          serviceId: serviceId,
        },
      })
      .pipe(catchError(this.handleError));
  }
  addEmployeeToPreference(employeeId: string) {
    return this.http
      .post(`${environment.serverUrl}/preferences/employees`, {
        employeeId: employeeId,
      })
      .pipe(catchError(this.handleError));
  }

  getPreferedEmployees() {
    return this.http
      .get<{
        preferedEmployees: {
          _id: string;
          firstname: string;
          lastname: string;
        }[];
      }>(`${environment.serverUrl}/preferences/employees`)
      .pipe(catchError(this.handleError));
  }

  removeFromPreferedEmployees(employeeId: string) {
    return this.http
      .delete(`${environment.serverUrl}/preferences/employees`, {
        body: {
          employeeId: employeeId,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getEmployeeList() {
    return this.http
      .get<{ _id: string; firstname: string; lastname: string }[]>(
        `${environment.serverUrl}/employees`
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
