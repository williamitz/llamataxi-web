import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResponse } from '../interfaces/response.interface';
import { AwardModel } from '../models/awards.model';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class AwardsService {

  constructor(private http: HttpClient, private st: StorageService) {}

  onAddAward(body: AwardModel) {
    return this.http.post<IResponse>(URI_API + `/Award`, body, {
      headers: { Authorization: this.st.token },
    });
  }

  onUpdateAward(body: AwardModel) {
    return this.http.put<IResponse>(URI_API + `/Award/${ body.pkAward }`, body, {
      headers: { Authorization: this.st.token },
    });
  }

  onDeleteAward(body: AwardModel) {
    return this.http.delete<IResponse>(URI_API + `/Award/${ body.pkAward }/${ body.statusRegister }`, {
      headers: { Authorization: this.st.token },
    });
  }

  onGetAward( page: number, rowsForPage: number, qName: string, showInactive: boolean ) {

    showInactive = showInactive ? false : true;

    const params = `?page=${ page }&rowsForPage=${ rowsForPage }&qName=${ qName }&showInactive=${ showInactive }`;
    return this.http.get<IResponse>(URI_API + `/Awards${ params }`, {
      headers: { Authorization: this.st.token },
    });
  }

  onUpload( pkAward: number, file: File ) {
    this.st.onLoadToken();
    const formData = new FormData();
    formData.append('file', file);

    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(URI_API + `/upload/award/${ pkAward }/`, formData, {headers: { Authorization: this.st.token } });

  }

}
