import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from './admin-layout.routes';
import { NavChildrenComponent } from '../../pages/adminPages/nav-children/nav-children.component';
import { NavPatherComponent } from '../../pages/adminPages/nav-pather/nav-pather.component';
import { HomeComponent } from '../../pages/adminPages/home/home.component';
import { ComponentsModule } from '../../components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { ApplicationComponent } from '../../pages/adminPages/application/application.component';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { AccountUserComponent } from '../../pages/adminPages/account-user/account-user.component';
import { ProfileDriverComponent } from '../../pages/adminPages/profile-driver/profile-driver.component';


@NgModule({
  declarations: [
    HomeComponent,
    NavPatherComponent,
    NavChildrenComponent,
    ApplicationComponent,
    AccountUserComponent,
    ProfileDriverComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    PipesModule,
    FormsModule,
    RouterModule.forChild( ADMIN_ROUTES )
  ]
})
export class AdminLayoutModule { }
