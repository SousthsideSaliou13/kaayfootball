/// <reference types="@angular/localize" />

// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Enregistrer la locale française
registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    { provide: LOCALE_ID, useValue: 'fr' }
  ]
}).catch((err) => console.error(err));
