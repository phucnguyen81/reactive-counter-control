import { Routes } from '@angular/router';

import { CounterComponent } from './counter/counter.component';
import { Counter2Component } from './counter2/counter2.component';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: CounterComponent },
  { path: 'counter', pathMatch: 'full', component: Counter2Component },
];
