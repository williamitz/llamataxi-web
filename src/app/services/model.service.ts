import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelModel } from '../models/model.model';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddModel(body: ModelModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/Model/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateModel(body: ModelModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/Model/Update/${body.pkModel}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteModel(body: ModelModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/Model/Delete/${body.pkModel}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListModel(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Model/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllCategory() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Category/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllBrand( fkCategory = 0 ) {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Brand/GetAll?fkCategory=${ fkCategory }`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
