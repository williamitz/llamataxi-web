import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { INotification, INotiSocket } from '../../interfaces/notification.interface';
import { UiService } from '../../services/ui.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import IJournalIO from 'src/app/interfaces/journal-socket.interface';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  title = '';
  ioNotify: Subscription;
  ioPanic: Subscription;
  ioCloseSbc: Subscription;

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
    this.onListenClose();
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

  onListenClose() {
    this.ioCloseSbc = this.io.onListen( 'close-journal' ).subscribe( (res: IJournalIO) => {
      this.uiSbc.onShowNotification(
        'Jornada cerrada',
        `${ res.nameDriver }, acaba de cerrar una jornada laboral`,
        './assets/img/icons/price-tag-4.png'
        );
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
    this.ioCloseSbc.unsubscribe();
  }

}
