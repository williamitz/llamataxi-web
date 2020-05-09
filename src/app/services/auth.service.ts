import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login.model';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment.prod';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  onLogin( body: LoginModel ) {
    return this.http.post<IResponse>( URI_API + `/login`, body );
  }
}
