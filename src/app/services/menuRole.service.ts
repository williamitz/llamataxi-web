import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MenuRoleModel } from "../models/menuRole.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class MenuRoleService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddMenuRole(body: MenuRoleModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/MenuRole/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateMenuRole(body: MenuRoleModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/MenuRole/Update/${body.pkMenuRole}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteMenuRole(body: MenuRoleModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/MenuRole/Delete/${body.pkMenuRole}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListMenuRole(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/MenuRole/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
  onGetListAllNavChildren() {
    this.storageSvc.onLoadToken();
    return this.http.get<IResponse>(URI_API + `/NavChildren/GetAll`, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
