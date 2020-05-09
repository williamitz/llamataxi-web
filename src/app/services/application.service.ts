import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppModel } from '../models/application.model';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor( private http: HttpClient, private storageSvc: StorageService ) { }

  onAddApp( body: AppModel ) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>( URI_API + `/Application/Add`, body, { headers: { Authorization: this.storageSvc.token } } );
  }

  onUpdateApp( body: AppModel ) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>( URI_API + `/Application/Update/${ body.pkApplication }`, body, { headers: { Authorization: this.storageSvc.token } } );
  }

  onDeleteApp( body: AppModel ) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>( URI_API + `/Application/Delete/${ body.pkApplication }/${ body.statusRegister }`, { headers: { Authorization: this.storageSvc.token } } );
  }



  onGetListApp( page: number, q: string, showInactive: boolean ) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${ page }&q=${ q }&showInactive=${ showInactive }`;

    return this.http.get<IResponse>( URI_API + `/Application/Get` + params, { headers: { Authorization: this.storageSvc.token } } );
  }
}
