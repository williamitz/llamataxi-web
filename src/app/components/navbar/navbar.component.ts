import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';
import { INotification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() dataNotify: INotification[];
  @Input() totalNews: number;

  title = '';
  dataUser: any = {};
  urlImg = environment.URL_SERVER + '/User/Img/Get/';
  token = '';

  // tslint:disable-next-line: max-line-length
  constructor( private routerActive: ActivatedRoute, private storageSbvc: StorageService, private router: Router, private notiSvc: NotificationService, private ioSvc: SocketService ) { }

  ngOnInit() {

    // console.log(this.router.snapshot.data);
    this.title = this.routerActive.snapshot.data.title;
    this.onLoadDataUser();
  }

  async onLoadDataUser() {
    this.dataUser = await this.storageSbvc.onGetItem('dataUser', true);
    this.storageSbvc.onLoadToken();
    this.token = `?token=${ this.storageSbvc.token }`;
  }

  onReaded( pkNoti: number ) {
    const finded = this.dataNotify.find( noti => noti.pkNotification === pkNoti );
    if (!finded) {
      throw new Error('Not found noti');
    }
    if (finded.readed === 0) {

      this.notiSvc.onReadedNoti( finded.pkNotification ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        finded.readed = 1;
        this.totalNews --;
      });
    }

  }

  onLogOut() {
    console.log('cerrando sesión =====================');
    this.ioSvc.onLogOutSocket().then( () => {

      // console.log('Se deconecto usuario socket con éxito');
      this.storageSbvc.onClear();
      this.router.navigateByUrl('/login');

    }).catch( (e) => {

      console.error('Error al desconectar socket', e);

    });

  }

}
