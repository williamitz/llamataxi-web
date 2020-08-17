import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor( private http: HttpClient, private storageSvc: StorageService ) { }

  onGetCards() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>( URI_API + `/NewUsers/Chart`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetServices( month: number, yearParam: number) {
    this.storageSvc.onLoadToken();
    const query = `?month=${ month }&year=${ yearParam }`;
    return this.http.get<IResponse>( URI_API + `/Services/Chart` + query, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetUsers( month: number, yearParam: number ) {
    this.storageSvc.onLoadToken();
    const query = `?month=${ month }&year=${ yearParam }`;
    return this.http.get<IResponse>( URI_API + `/Users/Chart` + query, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

}
