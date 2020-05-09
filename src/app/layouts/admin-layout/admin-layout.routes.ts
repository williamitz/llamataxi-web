import { Routes } from '@angular/router';
import { HomeComponent } from '../../pages/adminPages/home/home.component';
import { NavPatherComponent } from '../../pages/adminPages/nav-pather/nav-pather.component';
import { NavChildrenComponent } from '../../pages/adminPages/nav-children/nav-children.component';
import { ApplicationComponent } from '../../pages/adminPages/application/application.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home', data: { title: 'Dashboard' }},
  { path: 'home', component: HomeComponent, data: { title: 'Dashboard' }},
  { path: 'navPather', component: NavPatherComponent },
  { path: 'navChildren', component: NavChildrenComponent },
  { path: 'application', component: ApplicationComponent, data: { title: 'Aplicaciones' } },

];


