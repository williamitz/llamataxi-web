import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OsService {

  constructor(private http: HttpClient) { }

  onSendPushUser( odId: string, title: string, msg: string ) {
    const body = {
      app_id: environment.OS_APP ,
      // included_segments: ['Active Users', 'Inactive Users'],
      contents: { es: msg, en: 'Your have a new message' },
      headings: { es: title, en: 'Llamataxi app'  },
      include_player_ids: [ odId ]
    };
    return this.http.post( '/v1/notifications', body, {headers: { Authorization: `Basic ${ environment.OS_KEY }` }} );
  }
}
