import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public statusSocket = false;
  constructor( private io: Socket ) { }

  onStatusSocket() {
    this.io.on('connect', () => {
      this.statusSocket = true;
      console.log('conectado a socket');
    });

    this.io.on('disconnect', () => {
      this.statusSocket = true;
      console.log('desconectado a socket');
    });
  }

}
