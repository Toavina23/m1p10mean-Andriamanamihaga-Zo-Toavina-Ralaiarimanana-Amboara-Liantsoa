import {
  HttpInterceptorFn,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const urlsToAddToken = ['/api/appointments'];
export const AuthInterceptorFunction: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const url = new URL(req.url, window.location.origin);
  console.log(url.pathname);
  if (urlsToAddToken.includes(url.pathname)) {
    const authToken = authService.getToken();
    const authReq = req.clone({
      headers: req.headers.set('authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  } else {
    return next(req);
  }
};
