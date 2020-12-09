import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResponse } from '../interfaces/response.interface';
import { LiquidationModel } from '../models/liquidation.model';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class LiquidationService {

  constructor(private http: HttpClient, private st: StorageService) {}

  onGetJournal( page: number, rowsForPage: number, qName: string, showInactive: boolean ) {
    showInactive = showInactive ? false : true;

    const params = `?page=${ page }&rowsForPage=${ rowsForPage }&qName=${ qName }&showInactive=${ showInactive }`;

    return this.http.get<IResponse>(URI_API + `/Liquidation${ params }`, {
      headers: { Authorization: this.st.token },
    });
  }

  onGetAccountDriver( pkDriver: number ) {

    return this.http.get<IResponse>(URI_API + `/Account/Driver/${ pkDriver }`, {
      headers: { Authorization: this.st.token },
    });

  }

  onGetServices( page: number, pkDriver: number, fkJournal: number, codeJournal: string ) {

    const params = `?page=${ page }&pkDriver=${ pkDriver }&fkJournal=${ fkJournal }&codeJournal=${ codeJournal }`;
    return this.http.get<IResponse>(URI_API + `/Services/Journal${ params }`, {
      headers: { Authorization: this.st.token },
    });

  }

  onAddLiquidation( body: LiquidationModel ) {
    return this.http.post<IResponse>(URI_API + `/Liquidation`, body, {
      headers: { Authorization: this.st.token },
    });
  }

  onUpload( pkLiquidation: number, file: File ) {

    const formData = new FormData();
    formData.append('file', file);

    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(URI_API + `/upload/voucher/${ pkLiquidation }/`, formData, {headers: { Authorization: this.st.token } });

  }

}
