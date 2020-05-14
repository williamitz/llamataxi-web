import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MessageModel } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private storageSvc: StorageService) { }

  onAddMessage( body: MessageModel ) {
    this.storageSvc.onLoadToken();
    return this.http.post<IResponse>( URI_API + `/Message/Add`, body, {headers: { Authorization: this.storageSvc.token }} );
  }

  onGetMessages( pkUser: number, page: number, rowsForPage: number, showInactive = true) {
    this.storageSvc.onLoadToken();
    const params = `?pkUser=${ pkUser }&page=${ page }&rowsForPage=${ rowsForPage }&showInactive=${ showInactive }`;
    return this.http.get<IResponse>( URI_API + `/Message/Get${ params }`, {headers: { Authorization: this.storageSvc.token }} );
  }

  onGetResponseMsg( pkMessage: number ) {
    this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.get<IResponse>( URI_API + `/Message/Get/Response/${ pkMessage }`, {headers: { Authorization: this.storageSvc.token }} );
  }

  onAddMsgRes( body: MessageModel ) {
    this.storageSvc.onLoadToken();
    return this.http.post<IResponse>( URI_API + `/Message/Add/Response`, body, {headers: { Authorization: this.storageSvc.token }} );
  }

}
