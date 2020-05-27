
import { ProfileDriverComponent } from '../../pages/adminPages/profile-driver/profile-driver.component';
import { TaxiMapComponent } from '../../pages/adminPages/taxiMap/taxiMap.component';
import { Routes } from '@angular/router';
import { HomeComponent } from '../../pages/adminPages/home/home.component';
import { NavFatherComponent } from '../../pages/adminPages/nav-father/nav-father.component';
import { BrandComponent } from '../../pages/adminPages/brand/brand.component';
import { NavChildrenComponent } from '../../pages/adminPages/nav-children/nav-children.component';
import { ModelComponent } from '../../pages/adminPages/model/model.component';
import { MenuRoleComponent } from '../../pages/adminPages/menuRole/menuRole.component';
import { NotificationComponent } from '../../pages/adminPages/notification/notification.component';
import { VehicleDriverComponent } from '../../pages/adminPages/vehicleDriver/vehicleDriver.component';
import { CategoryComponent } from '../../pages/adminPages/category/category.component';
import { ApplicationComponent } from '../../pages/adminPages/application/application.component';
import { AccountUserComponent } from '../../pages/adminPages/account-user/account-user.component';
import { ProfileUserComponent } from '../../pages/adminPages/profile-user/profile-user.component';
import { AllowUrlGuard } from '../../guards/allow-url.guard';
import { JournalComponent } from '../../pages/adminPages/journal/journal.component';
import { RateComponent } from '../../pages/adminPages/rate/rate.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
    data: { title: 'Dashboard' },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'navFather',
    component: NavFatherComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'navChildren',
    component: NavChildrenComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'brand',
    component: BrandComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'model',
    component: ModelComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'menuRole',
    component: MenuRoleComponent,
    canActivate: [AllowUrlGuard]
  },

  {
    path: 'vehicleDriver',
    component: VehicleDriverComponent
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'taxiMap',
    component: TaxiMapComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'application',
    component: ApplicationComponent,
    data: { title: 'Aplicaciones' },
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'accountUser',
    component: AccountUserComponent,
    data: { title: 'Cuentas de usuario' },
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'profileDriver/:id',
    component: ProfileDriverComponent,
    data: { title: 'Perfil del conductor' },
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'profileUser/:id',
    component: ProfileUserComponent,
    data: { title: 'Perfil del usuario' },
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'journal',
    component: JournalComponent,
    canActivate: [AllowUrlGuard]
  },
  {
    path: 'rate',
    component: RateComponent,
    canActivate: [AllowUrlGuard]
  },

];
