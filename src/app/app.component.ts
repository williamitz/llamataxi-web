import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';

declare var swal: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'llamataxi-web';
  constructor( private ioSvc: SocketService ) {}
  ngOnInit() {
    this.ioSvc.onStatusSocket();
  }
}
