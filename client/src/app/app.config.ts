import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    /*withInterceptors([
      (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>  {

      }
    ])*/
  ],
};
