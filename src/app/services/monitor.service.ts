import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
const URI_API = environment.URL_SERVER;
@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  constructor( private http: HttpClient , private st: StorageService) { }

  onGetDrivers() {
    // console.log('llamando ');
    this.st.onLoadToken();

    return this.http.post<IResponse>( URI_API + `/Monitor/Drivers`, {}, {headers: { Authorization: this.st.token }} );

  }

}
