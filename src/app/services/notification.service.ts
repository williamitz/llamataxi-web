import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationModel } from '../models/notification.model';
import { IResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  onAddNotification(body: NotificationModel) {
    // this.storageSvc.onLoadToken();
    return this.http.post<IResponse>(URI_API + `/Notification/Add`, body, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onUpdateNotification(body: NotificationModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.put<IResponse>(
      URI_API + `/Notification/Update/${body.pkNotification}`,
      body,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onDeleteNotification(body: NotificationModel) {
    // this.storageSvc.onLoadToken();
    // tslint:disable-next-line: max-line-length
    return this.http.delete<IResponse>(
      URI_API +
        `/Notification/Delete/${body.pkNotification}/${body.statusRegister}`,
      { headers: { Authorization: this.storageSvc.token } }
    );
  }

  onGetListNotification(page: number, q: number, showInactive: boolean) {
    showInactive = showInactive ? false : true;
    this.storageSvc.onLoadToken();
    const params = `?page=${page}&q=${q}&showInactive=${showInactive}`;

    return this.http.get<IResponse>(URI_API + `/Notification/Get` + params, {
      headers: { Authorization: this.storageSvc.token },
    });
  }

  onGetNotifyReceptor() {

    this.storageSvc.onLoadToken();

    return this.http.get<IResponse>(URI_API + `/Notification/Get/Receptor`, { headers: { Authorization: this.storageSvc.token }});

  }

  onReadedNoti( pkNoti: number ) {

    this.storageSvc.onLoadToken();

    return this.http.put<IResponse>(URI_API + `/Notification/Readed/${pkNoti}`, {}, { headers: { Authorization: this.storageSvc.token }});

  }
}
