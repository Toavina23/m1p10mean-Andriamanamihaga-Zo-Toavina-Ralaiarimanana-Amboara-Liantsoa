import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Bookmark,
  Heart,
  UserRound,
  Hourglass,
  GripVertical,
  Receipt,
} from 'lucide-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNgxStripe } from 'ngx-stripe';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Bookmark,
        Heart,
        UserRound,
        Hourglass,
        GripVertical,
        Receipt
      })
    ),
    provideAnimationsAsync(),
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    provideNgxStripe(environment.stripePublicKey),
  ],
};
