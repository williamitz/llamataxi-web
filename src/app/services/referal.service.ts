import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../interfaces/response.interface';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment.prod';
import { ConfigReferal } from '../models/configReferal.model';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class ReferalService {

  constructor( private http: HttpClient, private st: StorageService ) { }

  onGetConfig() {
    this.st.onLoadToken();
    return this.http.get<IResponse>( URI_API + `/ConfigReferal`, {
      headers: { Authorization: this.st.token },
    });
  }

  onUpdateConfig( body: ConfigReferal ) {
    this.st.onLoadToken();
    return this.http.post<IResponse>( URI_API + `/ConfigReferal`, body, {
      headers: { Authorization: this.st.token },
    });
  }

}
