import { Routes } from "@angular/router";
import { HomeComponent } from "../../pages/adminPages/home/home.component";
import { NavFatherComponent } from "../../pages/adminPages/nav-father/nav-father.component";
import { NavChildrenComponent } from "../../pages/adminPages/nav-children/nav-children.component";
import { ApplicationComponent } from "../../pages/adminPages/application/application.component";
import { AccountUserComponent } from "../../pages/adminPages/account-user/account-user.component";
import { BrandComponent } from "../../pages/adminPages/brand/brand.component";
import { ModelComponent } from "../../pages/adminPages/model/model.component";
import { MenuRoleComponent } from "../../pages/adminPages/menuRole/menuRole.component";
import { NotificationComponent } from "../../pages/adminPages/notification/notification.component";
import { VehicleDriverComponent } from "../../pages/adminPages/vehicleDriver/vehicleDriver.component";
import { CategoryComponent } from "../../pages/adminPages/category/category.component";
import { TaxiMapComponent } from "src/app/pages/adminPages/taxiMap/taxiMap.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
    data: { title: "Dashboard" },
  },
  { path: "home", component: HomeComponent, data: { title: "Dashboard" } },
  { path: "navFather", component: NavFatherComponent },
  { path: "navChildren", component: NavChildrenComponent },
  { path: "brand", component: BrandComponent },
  { path: "model", component: ModelComponent },
  { path: "menuRole", component: MenuRoleComponent },
  { path: "notification", component: NotificationComponent },
  { path: "vehicleDriver", component: VehicleDriverComponent },
  { path: "category", component: CategoryComponent },
  { path: "taxiMap", component: TaxiMapComponent },

  {
    path: "application",
    component: ApplicationComponent,
    data: { title: "Aplicaciones" },
  },
  {
    path: "accountUser",
    component: AccountUserComponent,
    data: { title: "Cuentas de usuario" },
  },
];
