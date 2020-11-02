import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResponse } from '../interfaces/response.interface';
import { CJournalModel } from '../models/configJournal.model';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class ConfigJournalService {

  constructor(private http: HttpClient, private st: StorageService) {}

  onAddConfig(body: CJournalModel) {
    return this.http.post<IResponse>(URI_API + `/ConfigJournal`, body, {
      headers: { Authorization: this.st.token },
    });
  }

  onUpdateConfig(body: CJournalModel) {
    return this.http.put<IResponse>(URI_API + `/ConfigJournal/${ body.pkConfigJournal }`, body, {
      headers: { Authorization: this.st.token },
    });
  }

  onGetConfig( page: number, showInactive = false ) {
    showInactive = showInactive ? false : true;
    return this.http.get<IResponse>(URI_API + `/ConfigJournal?page=${ page }&showInactive=${ showInactive }`, {
      headers: { Authorization: this.st.token } });
  }


  onDelConfig( body: CJournalModel ) {
    return this.http.delete<IResponse>(URI_API + `/ConfigJournal/${ body.pkConfigJournal }/${ body.statusRegister }`, {
      headers: { Authorization: this.st.token } });
  }

}
