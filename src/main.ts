import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import *as Fr from '@angular/common/locales/fr'

registerLocaleData(Fr.default)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
