import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PagerService } from '../../../services/pager.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';

const URI_API = environment.URL_SERVER;
@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})
export class AccountUserComponent implements OnInit {

  dataUser: any[] = [];

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  loadData = false;
  loading = false;
  pathImg = URI_API + `/User/Img/Get/`;
  token = '';
  showInactive = false;
  titleModal = 'Nuevo usuario';
  txtButton = 'Guardar';

  /**
   * dateVerified: null
   * document: "03653617"
   * email: "Acb.industri@hotmail.com"
   * fkUserVerified: null
   * img: "2-photo.png"
   * name: "ANGELO"
   * nameComplete: "CALLE BERMEO, ANGELO"
   * nameCountry: "Perú"
   * nameDocument: "Documento nacional de identidad"
   * phone: "949503460"
   * pkDriver: 2
   * pkPerson: 2
   * prefix: "DNI"
   * prefixPhone: "+51"
   * role: "DRIVER_ROLE"
   * surname: "CALLE BERMEO"
   * userName: "949503460"
   * verified: 0
   * verifyReniec: 1
   */

  constructor( private userSvc: UserService , private pagerSvc: PagerService, private storage: StorageService) { }

  ngOnInit() {
    this.storage.onLoadToken();
    this.token = `?token=${ this.storage.token }`;
    this.onGetListUser( 1 );
  }

  onGetListUser( page: number, chk = false ) {
    this.userSvc.onGetUser( page, 10, '', '', '', '', true ).subscribe( (res) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataUser = res.data;
      this.pagination = this.pagerSvc.getPager(res.total, page, 10);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * 10) + 1;
        const vend = ((this.pagination.currentPage - 1) * 10) + this.dataUser.length;
        this.infoPagination = `Mostrando del ${ start } al ${ vend } de ${ res.total } registros.`;
      }

    });
  }

}
