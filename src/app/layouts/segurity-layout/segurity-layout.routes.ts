import { Routes } from '@angular/router';

// import { PageNotFoundComponent } from './';
import { MonitorServiceComponent } from '../../pages/segurityPages/monitor-service/monitor-service.component';

export const SEGURITY_ROUTES: Routes = [
  { path: 'monitor/:tokenMonitor', component: MonitorServiceComponent },
  // { path: '**', redirectTo: '/notFound' },

  // { path: '**', component: PageNotFoundComponent },

  // { path: 'path/:routeParam', component: MyComponent },
  // { path: 'staticPath', component: ... },
  // { path: '**', component: ... },
  // { path: ..., component: ..., data: { message: 'Custom' }
];
