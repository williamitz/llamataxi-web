import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class OsService {

  constructor(private http: HttpClient, private st: StorageService) { }

  onSendPushUser( osId: string[], title: string, message: string ) {

    this.st.onLoadToken();
    const body = { message, title, osId, data: { accepted: false, declined: false }, template_id: '9d2ad516-a641-4d44-b000-15d6adbbebdc' };
    return this.http.post<IResponse>( URI_API + '/Push/Send', body, {headers: { Authorization: this.st.token }} );
  }
}
