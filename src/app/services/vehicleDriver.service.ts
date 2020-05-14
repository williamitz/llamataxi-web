import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VehicleDriverModel } from "../models/vehicleDriver.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class VehicleDriverService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddVehicleDriver(body: VehicleDriverModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/VehicleDriver/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateVehicleDriver(body: VehicleDriverModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/VehicleDriver/Update/${body.pkVehicleDriver}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteVehicleDriver(body: VehicleDriverModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API +
        `/VehicleDriver/Delete/${body.pkVehicleDriver}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListVehicleDriver(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/VehicleDriver/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllDriver() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Driver/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllBrand() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Brand/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllModel() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Model/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
