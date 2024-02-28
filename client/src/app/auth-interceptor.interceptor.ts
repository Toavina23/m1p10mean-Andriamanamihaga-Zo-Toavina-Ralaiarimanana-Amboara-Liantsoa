import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const urlsToAddToken = [
  '/api/appointments',
  '/api/services',
  '/api/payments/paymentIntents',
];
const regexUrlsToAddToken = [
  /^\/api\/services\/[^\/]+\/employees$/, // Regex to match /services/:id/employees
  /^\/api\/promotionCodes\/[A-Za-z0-9]*$/, // Regex to match /promotionCodes/:code
  /^\/api\/appointments\/[A-Za-z0-9]*$/, // Regex to match /appointments/:code
];

export const AuthInterceptorFunction: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const url = new URL(req.url, window.location.origin);
  console.log(url.pathname);
  const isPathMatchingRegex = (pathname: string) =>
    regexUrlsToAddToken.some((pattern) => pattern.test(pathname));
  if (
    urlsToAddToken.includes(url.pathname) ||
    isPathMatchingRegex(url.pathname)
  ) {
    const authToken = authService.getToken();
    const authReq = req.clone({
      headers: req.headers.set('authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  } else {
    return next(req);
  }
};
