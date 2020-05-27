import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JournalModel } from "../models/journal.model";
import { IResponse } from "../interfaces/response.interface";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: "root",
})
export class JournalService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddJournal(body: JournalModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/Journal/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateJournal(body: JournalModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/Journal/Update/${body.pkJournal}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteJournal(body: JournalModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API + `/Journal/Delete/${body.pkJournal}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListJournal(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Journal/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }
}
