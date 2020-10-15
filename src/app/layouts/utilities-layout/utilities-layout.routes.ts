import { Routes } from '@angular/router';

// import { PageNotFoundComponent } from './';
import { RestoreAccountComponent } from '../../pages/utilitiesPages/restore-account/restore-account.component';

export const UTILITIES_ROUTES: Routes = [
  { path: 'restore/:tokenRestore', component: RestoreAccountComponent },
  // { path: 'path2', component: Name2Component },
  // { path: 'path3', component: Name3Component },
  // { path: 'path4', component: Name4Component },
  // { path: '**', component: PageNotFoundComponent },

  // { path: 'path/:routeParam', component: MyComponent },
  // { path: 'staticPath', component: ... },
  // { path: '**', component: ... },
  // { path: 'oldPath', redirectTo: '/staticPath' },
  // { path: ..., component: ..., data: { message: 'Custom' }
];

