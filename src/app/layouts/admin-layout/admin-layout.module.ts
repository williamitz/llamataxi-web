
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from './admin-layout.routes';
import { NavChildrenComponent } from '../../pages/adminPages/nav-children/nav-children.component';
import { NavFatherComponent } from '../../pages/adminPages/nav-father/nav-father.component';
import { HomeComponent } from '../../pages/adminPages/home/home.component';
import { ComponentsModule } from '../../components/components.module';
import { ApplicationComponent } from '../../pages/adminPages/application/application.component';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { AccountUserComponent } from '../../pages/adminPages/account-user/account-user.component';
import { BrandComponent } from '../../pages/adminPages/brand/brand.component';
import { NotificationComponent } from '../../pages/adminPages/notification/notification.component';
import { ModelComponent } from '../../pages/adminPages/model/model.component';
import { MenuRoleComponent } from '../../pages/adminPages/menuRole/menuRole.component';
import { CategoryComponent } from '../../pages/adminPages/category/category.component';
import { VehicleDriverComponent } from '../../pages/adminPages/vehicleDriver/vehicleDriver.component';
import { TaxiMapComponent } from './../../pages/adminPages/taxiMap/taxiMap.component';
import { AgmCoreModule } from '@agm/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileDriverComponent } from '../../pages/adminPages/profile-driver/profile-driver.component';
import { ProfileUserComponent } from '../../pages/adminPages/profile-user/profile-user.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavFatherComponent,
    NavChildrenComponent,
    ApplicationComponent,
    AccountUserComponent,
    BrandComponent,
    NotificationComponent,
    ModelComponent,
    MenuRoleComponent,
    CategoryComponent,
    VehicleDriverComponent,
    TaxiMapComponent,
    ProfileDriverComponent,
    ProfileUserComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    PipesModule,
    FormsModule,
    NgSelectModule,
    SwiperModule,
    RouterModule.forChild(ADMIN_ROUTES),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDhxiGsJaQ7nBYRxhgc-qNI9KaGY9pwj0g",
    }),
  ],
})
export class AdminLayoutModule {}
