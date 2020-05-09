import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';

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

}
