import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Bookmark, Heart, UserRound, Hourglass, GripVertical } from 'lucide-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Bookmark, Heart, UserRound, Hourglass, GripVertical })), provideAnimationsAsync(),
  ],
};
