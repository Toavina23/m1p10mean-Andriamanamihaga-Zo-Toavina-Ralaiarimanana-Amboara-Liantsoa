import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { Service, Task } from '../types';
import { Subscription, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthService } from './auth.service';

export type EmployeeAvailability = {
  employeeId: string;
  firstname: string;
  lastname: string;
  availableIn: number;
};
export type NewTask = {
  start: Date;
  end: Date;
  serviceId: string;
  employeeId: string;
  employeeFullName: string;
};
@Injectable({
  providedIn: 'root',
})
export class AppointmentService implements OnDestroy {
  services: Service[] = [];
  private newTasks: NewTask[] = [];
  serviceFetchSubscription: Subscription | undefined;
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.serviceFetchSubscription = this.getAllService().subscribe();
  }
  ngOnDestroy() {
    this.serviceFetchSubscription?.unsubscribe();
  }

  public saveNewAppointment(appointmentDate: string, paymentId: string) {
    const startDate = new Date(
      new Date(appointmentDate).getTime() + 3 * 3600000
    )
      .toISOString()
      .slice(0, 16);
    const userId = this.authService.getUserId();
    const tasks = this.newTasks.map((task) => {
      return {
        start: new Date(task.start.getTime() + 3 * 3600000)
          .toISOString()
          .slice(0, 16),
        serviceId: task.serviceId,
        employeeId: task.employeeId,
      };
    });
    console.log(
      JSON.stringify({
        startDate: startDate,
        paymentId: paymentId,
        userId: userId,
        tasks: tasks,
      })
    );
    return this.http
      .post<{ status: string }>(
        `${environment.serverUrl}/appointments`,
        {
          startDate: startDate,
          paymentId: paymentId,
          userId: userId,
          tasks: tasks,
        },
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(catchError(this.handleError));
  }

  public getAllService() {
    return this.http
      .get<{ services: Service[] }>(`${environment.serverUrl}/services`, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Response) {
            const response = event.body;
            console.log(response);
            if (response != null) {
              this.services.splice(0);
              this.services.push(...response.services);
            }
          }
        }),
        catchError(this.handleError)
      );
  }
  public getEmployeeAvailability(serviceId: string, serviceDate: Date) {
    const urlParameters = new URLSearchParams();
    urlParameters.append(
      'startDate',
      new Date(serviceDate.getTime() + 3 * 3600000).toISOString().slice(0, 16)
    );
    return this.http
      .get<EmployeeAvailability[]>(
        `${
          environment.serverUrl
        }/services/${serviceId}/employees?${urlParameters.toString()}`,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(catchError(this.handleError));
  }
  public addNewTask(
    serviceId: string,
    employeeAvailability: EmployeeAvailability,
    startDate: Date
  ) {
    const service = this.getServiceById(serviceId);
    if (!service) return;
    this.newTasks.push({
      serviceId: serviceId,
      employeeFullName: `${employeeAvailability.firstname} ${employeeAvailability.lastname}`,
      employeeId: employeeAvailability.employeeId,
      start: new Date(
        startDate.getTime() + employeeAvailability.availableIn * 60_000
      ),
      end: new Date(startDate.getTime() + service.duration * 60_000),
    });
  }
  public reorderNewTasks(
    previousIndex: number,
    currentIndex: number,
    serviceDate: Date
  ) {
    const simulationArray = [...this.newTasks];
    moveItemInArray(simulationArray, previousIndex, currentIndex);
    let taskDate = new Date(serviceDate);
    let offsetInMinutes = 0;
    simulationArray.forEach((task) => {
      const service = this.getServiceById(task.serviceId);
      task.start = new Date(taskDate.getTime() + offsetInMinutes * 60 * 1000);
      task.end = new Date(task.start.getTime() + service!.duration * 60 * 1000);
      offsetInMinutes += service!.duration;
    });
    this.newTasks = simulationArray;
  }
  get getNewTasks() {
    return this.newTasks;
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

  public getServiceById(serviceId: string) {
    return this.services.find((service) => service._id == serviceId);
  }

  public getTotalBillingAmount() {
    return this.newTasks.reduce((accumulator, newTask) => {
      const service = this.getServiceById(newTask.serviceId);
      if (!service) return accumulator;
      return accumulator + service.price;
    }, 0);
  }
  public clearNewTasks() {
    this.newTasks = [];
  }
}
