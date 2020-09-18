import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RateModel } from '../models/rate.model';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root',
})
export class RateService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddRate(body: RateModel) {
    // this.storageSvc.onLoadToken();
    console.log('body');
    console.log(body);
    return this.http.post<IResponse>(URI_API + `/Rate/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateRate(body: RateModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/Rate/Update/${body.pkRate}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteRate(body: RateModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/Rate/Delete/${body.pkRate}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListRate(page: number, qCategory = '', qJournal = '', showInactive: boolean) {

    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&qCategory=${qCategory}&qJournal=${ qJournal }&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Rate/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetListAllCategory() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Category/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetListAllJournal() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Journal/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

}
