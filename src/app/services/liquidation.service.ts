import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResponse } from '../interfaces/response.interface';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class LiquidationService {

  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onGetJournal( page: number, rowsForPage: number, qName: string, showInactive: boolean ) {
    showInactive = showInactive ? false : true;

    const params = `?page=${ page }&rowsForPage=${ rowsForPage }&qName=${ qName }&showInactive=${ showInactive }`;

    return this.http.get<IResponse>(URI_API + `/Liquidation${ params }`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetAccountDriver( pkDriver: number ) {

    return this.http.get<IResponse>(URI_API + `/Account/Driver/${ pkDriver }`, {
      headers: { Authorization: this.storageSvc.token },
    });

  }

  onGetServices( page: number, pkDriver: number, fkJournal: number, codeJournal: string ) {

    const params = `?page=${ page }&pkDriver=${ pkDriver }&fkJournal=${ fkJournal }&codeJournal=${ codeJournal }`;
    return this.http.get<IResponse>(URI_API + `/Services/Journal${ params }`, {
      headers: { Authorization: this.storageSvc.token },
    });

  }

}
