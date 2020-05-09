import { Routes } from '@angular/router';


import { LoginComponent } from '../../pages/authPages/login/login.component';

export const AUTH_ROUTES: Routes = [
  { path: '', component: LoginComponent },

  { path: '**', component: LoginComponent },

  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

