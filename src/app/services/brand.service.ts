import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BrandModel } from "../models/brand.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class BrandService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddBrand(body: BrandModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/Brand/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateBrand(body: BrandModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/Brand/Update/${body.pkBrand}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteBrand(body: BrandModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/Brand/Delete/${body.pkBrand}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListBrand(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Brand/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllCategory() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/Category/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
