import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResponse } from '../interfaces/response.interface';
import { RestoreModel } from '../models/restore.model';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class RestoreService {

  constructor( private http: HttpClient ) {}

  onRestorePsw( body: RestoreModel, token: string ) {

    return this.http.post<IResponse>( URI_API + `/User/Restore`, body, { headers: { AuthRestore: token } });

  }

}
