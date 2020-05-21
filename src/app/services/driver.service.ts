import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';
import { VehicleVerifModel } from '../models/vehicleVerif.model';
import { DriverVerif } from '../models/driverVerif.model';

const URI_API = environment.URL_SERVER;
@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor( private http: HttpClient, private storage: StorageService ) { }

  onGetProfile( id: number ) {
    this.storage.onLoadToken();
    return this.http.put<IResponse>( URI_API + `/Driver/Profile/${ id }`, {}, {headers: { Authorization: this.storage.token }} );
  }

  onUploadDriver(entity = 'DRIVER', idEntity: number, document: string, pkDriver = 0, file: File) {

    const formData = new FormData();
    formData.append('file', file);

    const params = `?pkDriver=${ pkDriver }&admin=true`;
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(URI_API + `/upload/driver/${ entity }/${ idEntity }/${ document + params }`, formData, {headers: { Authorization: this.storage.token } });
  }

  onVerifyVehicle( body: VehicleVerifModel ) {
    this.storage.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>( URI_API + `/Vehicle/Verify/${ body.pkDriver }/${ body.pkVehicle }`, body, {headers: { Authorization: this.storage.token } } );
  }

  onVerifyDriver( body: DriverVerif ) {
    this.storage.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>( URI_API + `/Driver/verify/${ body.pkDriver }`, body, {headers: { Authorization: this.storage.token } } );

  }

}
