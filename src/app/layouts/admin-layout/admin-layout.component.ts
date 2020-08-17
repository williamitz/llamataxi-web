import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { INotification, INotiSocket } from '../../interfaces/notification.interface';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  title = '';
  notySbc: Subscription;
  dataNoti: INotification[] = [];
  totalNews = 0;
  // tslint:disable-next-line: max-line-length
  constructor( private router: ActivatedRoute, private io: SocketService, private notiSbc: NotificationService, private uiSbc: UiService ) { }

  ngOnInit() {
    // this.title = this.router.data;
    // console.log(this.router.snapshot.data);
    this.onListenNofify();
    this.onGetNotify();
    this.io.onStatusSocket();
  }

  onTitle(title) {
    console.log(title);
  }

  onListenNofify() {
    this.notySbc = this.io.onListen( 'new-notify-web' ).subscribe( (res: INotiSocket) => {
      console.log(res);
      this.onGetNotify();
      this.uiSbc.onShowNotification( res.title, res.message, '', res.urlShow );
    });
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
    this.notySbc.unsubscribe();
  }

}
