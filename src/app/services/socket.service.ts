import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IUserSocket } from '../interfaces/user-socket.interface';
import { StorageService } from './storage.service';
import { IResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private userSocket: IUserSocket = {
    pkUser: 0,
    userName: '',
    role: '',
    device: 'WEB'
  };
  public statusSocket = false;
  constructor( private io: Socket, private storageSvc: StorageService ) { }

  onStatusSocket() {
    this.io.on('connect', () => {
      this.statusSocket = true;
      console.log('conectado a socket');
      this.onSingUserSocket().then( (res) => {
          console.log('Usuario condigurado en socket', res);
      }).catch( (e) => {
        console.error(e);
      });
    });

    this.io.on('disconnect', () => {
      this.statusSocket = true;
      console.log('desconectado a socket');
    });
  }

  // tslint:disable-next-line: ban-types
  onEmit( event: string, payload: any, callback: Function ) {
    return this.io.emit( event, payload, callback );
  }

  onListen( event: string ) {
    return this.io.fromEvent( event );
  }

  onLoadUserSocket() {
    const dataUser = this.storageSvc.onGetItem('dataUser', true);
    this.userSocket.pkUser = dataUser.pkUser || 0;
    this.userSocket.userName = dataUser.userName || '';
    this.userSocket.role = dataUser.role || '';
  }

  onSingUserSocket(): Promise<IResponse> {
    this.onLoadUserSocket();

    return new Promise( (resolve, reject) => {
      this.onEmit( 'sing-user', this.userSocket, ( res: IResponse ) => {

        console.log('respuesta sing socket', res);
        if (!res.ok) {
          reject( res.error );
        }
        resolve( res );
      });
    });

  }

  onLogOutSocket(): Promise<IResponse> {
    this.onLoadUserSocket();

    return new Promise( (resolve, reject) => {

      this.onEmit('logout-user', this.userSocket, ( res: IResponse ) => {
        console.log('respuesta logout socket ', res);
        if (!res.ok) {
          reject( res.error );
        }
        resolve( res );
      });

    });
  }

}
