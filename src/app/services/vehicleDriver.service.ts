import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VehicleDriverModel } from '../models/vehicleDriver.model';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root',
})
export class VehicleDriverService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddVehicle(body: VehicleDriverModel) {
    this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/Vehicle/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateVehicle( body: VehicleDriverModel) {
    this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>( URI_API + `/Vehicle/Update/${body.pkVehicle}`, body, { headers: { Authorization: this.storageSvc.token } });
  }

  onDeleteVehicle(body: VehicleDriverModel) {
    this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>( URI_API + `/Vehicle/Delete/${body.pkVehicle}/${ body.fkDriver }/${body.statusRegister}`, { headers: { Authorization: this.storageSvc.token } } );
  }

  onGetListVehicle(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Vehicle/Get` + params, {
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
