import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PagerService } from '../../../services/pager.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';
import { UserModel } from 'src/app/models/user.model';
import { INationality } from 'src/app/interfaces/nationality.interface';
import { ITypeDocument } from '../../../interfaces/type-document.interface';
import { Subscription } from 'rxjs';
import { IRespReniec } from '../../../interfaces/reniec.interface';
import * as $ from 'jquery';
import { Options } from 'select2';
import { NgForm } from '@angular/forms';
import { SocketService } from '../../../services/socket.service';
import { IResponse } from 'src/app/interfaces/response.interface';
import { IUser } from 'src/app/interfaces/users.interface';
import { ChangePassModel } from '../../../models/changePass.model';
import swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';

const URI_API = environment.URL_SERVER;
@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})
export class AccountUserComponent implements OnInit, OnDestroy {

  userCnnSbc: Subscription;
  userDiscnnSbc: Subscription;
  passwordSbc: Subscription;
  dataUser: IUser[] = [];

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  loadData = false;
  loading = false;
  loadingReniec = false;
  loadingList = false;
  loadingPass = false;
  pathImg = URI_API + `/User/Img/Get/`;
  token = '';
  showInactive = false;
  titleModal = 'Nuevo usuario';
  txtButton = 'Guardar';

  qName = '';
  qUser = '';
  qEmail = '';
  qRole = '';
  qVerified = 2;
  qConnect = 2;

  dataNationality: INationality[] = [];
  dataTypeDoc: ITypeDocument[] = [];

  nationalitySbc: Subscription;
  typeDocSbc: Subscription;
  docLong = 8;
  showPassChange = false;

  bodyUser: UserModel;
  bodyChangePass: ChangePassModel;
  optCbx: Options = {
    theme: 'classic',
    closeOnSelect: false,
    width: '300',
    allowClear: true
  };
  prefix = '+';

  // tslint:disable-next-line: max-line-length
  constructor( private userSvc: UserService , private pagerSvc: PagerService, private storage: StorageService, private sk: SocketService) { }

  ngOnInit() {
    this.storage.onLoadToken();
    this.token = `?token=${ this.storage.token }`;
    this.bodyUser = new UserModel();
    this.bodyChangePass = new ChangePassModel();
    this.onGetListUser( 1 );
    this.onLoadTypeDoc();
    this.onLoadNationality();
    this.onListenConnections();
    this.onListenDisconnect();
  }

  onLoadTypeDoc() {
    this.nationalitySbc = this.userSvc.onGetTypeDocumentAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeDoc = res.data;
    });
  }

  onLoadNationality() {
    this.typeDocSbc = this.userSvc.onGetNationalityAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;
    });
  }

  onGetListUser( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.loadingList = true;
    this.userSvc.onGetUser( page,
                              10,
                              this.qName,
                              this.qEmail,
                              this.qUser,
                              this.qRole,
                              this.qVerified,
                              this.qConnect,
                              this.showInactive ).subscribe( (res) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      this.loadingList = false;
      this.dataUser = res.data;
      this.pagination = this.pagerSvc.getPager(res.total, page, 10);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * 10) + 1;
        const vend = ((this.pagination.currentPage - 1) * 10) + this.dataUser.length;
        this.infoPagination = `Mostrando del ${ start } al ${ vend } de ${ res.total } registros.`;
      }

    });
  }

  onChangeCountry(event: INationality) {
    this.prefix = event.prefixPhone;
    console.log(event);
  }

  onChangeDocument() {
    console.log('cambio', this.bodyUser.document.length);
    if ( this.bodyUser.fkTypeDocument === 1 && this.bodyUser.document.length === 8 ) {
      this.loadingReniec = true;
      this.userSvc.onGetReniec( this.bodyUser.document ).subscribe( (res: IResponse) => {
        this.loadingReniec = false;
        if (!res.ok) {
          console.log(' no encontrado');
          this.bodyUser.verifyReniec = false;
          return;
        }
        console.log(res);
        const dataReniec: any = res.data;
        if (dataReniec.dni === '') {
          this.bodyUser.verifyReniec = false;
          return;
        }
        this.bodyUser.verifyReniec = true;
        this.bodyUser.name = dataReniec.nombres,
        this.bodyUser.surname = `${ dataReniec.apellido_paterno } ${ dataReniec.apellido_materno }`;
      });
    }
  }

  onSubmitUser( frm: NgForm ) {
    if (frm.valid) {

      this.loading = true;
      if (!this.loadData) {
        this.userSvc.onAddUser( this.bodyUser ).subscribe( (res) => {
          if (!res.ok) {
            throw new Error( res.error );
          }

          const { msg, css, icon } = this.onGetError( res.showError );
          this.loading = false;

          if (res.showError !== 0) {
            this.onShowAlert('alertUserModal', css, icon, msg );
            return;
          }
          this.onShowAlert('alertUser', css, icon, msg );
          $('#btnCloseModal').trigger('click');
          this.onGetListUser(1);
        });

        return;
      }

      console.log(this.bodyUser);
    }
  }

  onListenConnections() {
    this.userCnnSbc = this.sk.onListen('user-connect').subscribe( (payload: any) => {
      const finded = this.dataUser.find( user => Number(user.pkUser) === Number( payload.pkUser ) );
      if (finded) {
        finded.statusSocket = true;
      }
    });
  }

  onListenDisconnect() {
    this.userDiscnnSbc = this.sk.onListen('user-disconnect').subscribe( (payload: any) => {
      const finded = this.dataUser.find( user => Number(user.pkUser) === Number( payload.pkUser ) );
      if (finded) {
        finded.statusSocket = false;
      }
    });
  }

  onShowAlert( idAlert: string, css: string, icon: string, msg: string ) {
    let html = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    html += `<span class="alert-icon"><i class="fa fa-${ icon }"></i></span>`;
    html += `<span class="alert-text"> ${ msg } </span>`;
    html += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    html += `<span aria-hidden="true">&times;</span>`;
    html += `</button>`;
    html += `</div>`;

    $(`#${ idAlert }`).html(html);
  }

  onResetForm() {
    this.loadData = false;
    this.titleModal = 'Nuevo usuario';
    this.txtButton = 'Guardar';

    $('#frmUser').trigger('click');
    this.bodyUser.onReset();
  }

  onChangeTypeDoc() {
    const finded = this.dataTypeDoc.find( doc => doc.pkTypeDocument = this.bodyUser.fkTypeDocument );
    if (!finded) {
      throw new Error('No se encontró registro');
    }

    this.docLong = finded.longitude;
  }

  onShowChangePassword( user: IUser ) {
    this.bodyChangePass.password = '';
    this.bodyChangePass.pkUser = user.pkUser;
    this.bodyChangePass.nameComplete = user.nameComplete;
    this.bodyChangePass.img = user.img;
    $('#btnShowModalPassword').trigger('click');
  }

  onSubmitChangePass() {
    if ( this.passwordSbc ) {
      this.passwordSbc.unsubscribe();
    }

    swal.showLoading();
    this.passwordSbc = this.userSvc.onChangePass( this.bodyChangePass ).subscribe( (res) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      swal.hideLoading();
      const { text, icon } = this.onGetErrorPass( res.showError );
      swal.fire({
        title: 'Mensaje al usuario',
        text,
        icon
      });

      if (res.showError === 0) {
        this.bodyChangePass.onReset();
        $('#btnCloseModalPass').trigger('click');
      }

    });
  }

  onGetError( showError: number ) {
    let arrError = showError === 0 ? ['Se ha creado un nuevo usuario con éxito'] : ['Ya existe un registro'];
    const css = showError === 0 ? 'success' : 'danger';
    const icon = showError === 0 ? 'check' : 'exclamation-circle';

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('con este usuario');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('con este email');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('ya existe un usuario con el nro de documento y rol');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 16) {
      arrError = ['No se encontró tipo de documento'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 16) {
      arrError = ['No se encontró nacionalidad'];
    }

    return { msg: arrError.join(', '), css, icon };

  }

  onGetErrorPass( showError: number ) {
    const arrError = showError === 0 ? ['Se ha cambiado la contraseña exitosamente'] : ['Error'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'error';

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró usuario');
    }

    return { text: arrError.join(', '), icon };

  }

  ngOnDestroy() {
    this.nationalitySbc.unsubscribe();
    this.typeDocSbc.unsubscribe();
    this.userCnnSbc.unsubscribe();
    this.userDiscnnSbc.unsubscribe();

    if ( this.passwordSbc ) {
      this.passwordSbc.unsubscribe();
    }

  }

}
