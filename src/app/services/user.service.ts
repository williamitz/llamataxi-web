import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  onGetUser( page: number, rowsForPage: number, qName = '', qEmail = '', qUser = '', qRole = '', showInactive: boolean ) {
    let params = `?page=${page}`;
    params += `&rowsForPage=${rowsForPage}`;
    params += `&qName=${qName}`;
    params += `&qEmail=${qEmail}`;
    params += `&qUser=${qUser}`;
    params += `&qRole=${qRole}`;
    params += `&showInactive=${showInactive}`;
    this.storage.onLoadToken();
    return this.http.get<IResponse>( URI_API + `/User/Get${ params }`, { headers: { Authorization: this.storage.token } } );
  }

}
