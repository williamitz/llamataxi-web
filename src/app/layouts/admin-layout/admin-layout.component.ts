import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { INotification, INotiSocket } from '../../interfaces/notification.interface';
import { UiService } from '../../services/ui.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  title = '';
  ioNotify: Subscription;
  ioPanic: Subscription;
  dataNoti: INotification[] = [];
  totalNews = 0;

  msgPanic = '';
  urlPanic = '';
  // tslint:disable-next-line: max-line-length
  constructor( private router: Router, private io: SocketService, private notiSbc: NotificationService, private uiSbc: UiService ) { }

  ngOnInit() {
    this.onGetNotify();
    this.io.onStatusSocket();
    this.onListenNofify();
    this.onListenAlertPanic();
  }

  onTitle(title) {
    console.log(title);
  }

  onListenNofify() {
    this.ioNotify = this.io.onListen( 'new-notify-web' ).subscribe( (res: INotiSocket) => {
      console.log(res);
      this.onGetNotify();
      this.uiSbc.onShowNotification( res.title, res.message, '', res.urlShow );
    });
  }

  onListenAlertPanic() {
    this.ioPanic = this.io.onListen( 'new-alert-service' ).subscribe( (res: any) => {
      console.log(res);
      this.msgPanic = res.msg;
      this.urlPanic = res.url;
      $('#btnShowModalPanic').trigger('click');
    });
  }

  onRedirectPanic() {
    this.router.navigateByUrl( this.urlPanic );
  }

  onGetNotify() {
    this.notiSbc.onGetNotifyReceptor().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataNoti = res.data;
      this.totalNews = this.dataNoti.filter(n => n.readed === 0).length;

    });
  }

  ngOnDestroy() {
    this.ioNotify.unsubscribe();
    this.ioPanic.unsubscribe();
  }

}
