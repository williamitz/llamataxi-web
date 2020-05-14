import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavFatherModel } from "../models/navFather.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class NavFatherService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddNavFather(body: NavFatherModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/NavFather/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateNavFather(body: NavFatherModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/NavFather/Update/${body.pkNavFather}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteNavFather(body: NavFatherModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/NavFather/Delete/${body.pkNavFather}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListNavFather(page: number, q: string, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;
    return this.http.get<IResponse>(URI_API + `/NavFather/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
