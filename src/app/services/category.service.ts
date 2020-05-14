import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CategoryModel } from "../models/category.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddCategory(body: CategoryModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/Category/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateCategory(body: CategoryModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/Category/Update/${body.pkCategory}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteCategory(body: CategoryModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/Category/Delete/${body.pkCategory}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListCategory(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Category/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
