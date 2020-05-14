import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavChildrenModel } from "../models/navChildren.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class NavChildrenService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddNavChildren(body: NavChildrenModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/NavChildren/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateNavChildren(body: NavChildrenModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/NavChildren/Update/${body.pkNavChildren}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteNavChildren(body: NavChildrenModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API +
        `/NavChildren/Delete/${body.pkNavChildren}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListNavChildren(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/NavChildren/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetListAllNavFather() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/NavFather/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
