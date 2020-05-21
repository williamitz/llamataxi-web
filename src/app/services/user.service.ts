import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';
import { UserModel } from '../models/user.model';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  onGetUser( page: number, rowsForPage: number, qName = '', qEmail = '', qUser = '', qRole = '', showInactive: boolean ) {

    showInactive = showInactive ? false : true;

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

  onAddUser( body: UserModel ) {
    return this.http.post<IResponse>( URI_API + `/User/Add`, body, { headers: { Authorization: this.storage.token } } );
  }

  onGetNationalityAll() {
    // this.storage.onLoadToken();
    return this.http.get<IResponse>( URI_API + `/nationality/GetAll`, { headers: { Authorization: this.storage.token } } );
  }

  onGetTypeDocumentAll() {
    // this.storage.onLoadToken();
    return this.http.get<IResponse>( URI_API + `/typeDocument/GetAll`, { headers: { Authorization: this.storage.token } } );
  }

  onGetReniec( document: string ) {
    return this.http.get( `/dni/${ document }` );
  }


  onGetProfile( pkUser: number ) {
    this.storage.onLoadToken();
    return this.http.get<IResponse>( URI_API + `/User/Profile/${ pkUser }`, { headers: { Authorization: this.storage.token } } );
  }

}
