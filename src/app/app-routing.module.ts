import { Routes } from '@angular/router';

import { CounterComponent } from './counter/counter.component';
import { CounterComponent as CounterComponent2 } from './counter2/counter.component';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: CounterComponent },
  { path: 'counter2', pathMatch: 'full', component: CounterComponent2 },
];
