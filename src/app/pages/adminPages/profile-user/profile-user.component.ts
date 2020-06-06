import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { IUserProfile } from '../../../interfaces/user-profile.interface';
import { StorageService } from '../../../services/storage.service';
import { environment } from '../../../../environments/environment';
import { UserProfileModel } from '../../../models/user.model';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { IMsg } from '../../../interfaces/message.interface';
import { MessageService } from '../../../services/message.service';
import { INationality } from '../../../interfaces/nationality.interface';
import { IRespReniec } from '../../../interfaces/reniec.interface';
import { ITypeDocument } from '../../../interfaces/type-document.interface';
import { MessageModel } from '../../../models/message.model';
import { SweetAlertIcon } from 'sweetalert2';
import Swal from 'sweetalert2';
import { OsService } from '../../../services/os.service';

const URL_BAK = environment.URL_SERVER;

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  typeDocSbc: Subscription;
  osSbc: Subscription;
  pkUser = 0;
  filesValid = ['PNG', 'JPG', 'JPEG'];
  dataProfile: IUserProfile = {
    pkUser: 0
  };

  bodyUser: UserProfileModel;
  bodyMessage: MessageModel;
  bodyResponse: MessageModel;
  dataMsg: IMsg[] = [];
  dataMsgRes: IMsg[] = [];
  dataViewMsg: IMsg = {
    pkMessage: 0
  };
  dataNationality: INationality[] = [];
  longitudeTD = 8;

  dataTypeDoc: ITypeDocument[] = [];
  token = '';
  pathImg = URL_BAK + `/User/Img/Get/`;
  loadingReniec = false;
  loading = false;
  newResponse = false;
  loadingResponse = false;
  bodyDisabled = {
    status: true,
    observation: ''
  };
  txtBtnDisabled = 'Deshabilitar';
  actionDisabled = 'deshabilitada';
  cssBtnDisabled = 'danger';
  iconBtnDisabled = 'fa-user-times'; // fa-user-chec
  loadingDisabled = false;

  fileProfile: File;
  loadingImg = false;

  // tslint:disable-next-line: max-line-length
  constructor(private router: ActivatedRoute, private userSvc: UserService, private st: StorageService, private msgSvc: MessageService, private os: OsService) { }

  ngOnInit() {
    this.bodyUser = new UserProfileModel();
    this.bodyMessage = new MessageModel( false );
    this.bodyResponse = new MessageModel( false );
    this.st.onLoadToken();
    this.st.onLoadData();

    this.token = this.st.token;
    this.pkUser = Number( this.router.snapshot.params.id ) || 0;
    this.onGetProfile();
    this.onLoadTypeDoc();
    this.onLoadNationality();
    this.onGetMessages();
  }

  onLoadNationality() {
    this.typeDocSbc = this.userSvc.onGetNationalityAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;
    });
  }

  onLoadTypeDoc() {
    this.userSvc.onGetTypeDocumentAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeDoc = res.data;

    });
  }

  onGetProfile() {
    Swal.fire({title: 'Espere...'});
    Swal.showLoading();
    this.userSvc.onGetProfile( this.pkUser ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data;
      this.txtBtnDisabled = this.dataProfile.statusRegister ? 'Deshabilitar' : 'Habilitar';
      this.cssBtnDisabled = this.dataProfile.statusRegister ? 'danger' : 'success';
      this.iconBtnDisabled = this.dataProfile.statusRegister ? 'fa-user-times' : 'fa-user-check';
      Swal.close();
    });
  }

  onEditProfile() {
    this.bodyUser.pkUser = this.pkUser;
    this.bodyUser.fkTypeDocument = this.dataProfile.fkTypeDocument;
    this.bodyUser.fkNationality = this.dataProfile.fkNationality;
    this.bodyUser.document = this.dataProfile.document;
    this.bodyUser.name = this.dataProfile.name;
    this.bodyUser.img = URL_BAK + `/User/Img/Get/${ this.dataProfile.img }?token=${ this.token }`;
    this.bodyUser.surname = this.dataProfile.surname;
    this.bodyUser.email = this.dataProfile.email;
    this.bodyUser.phone = this.dataProfile.phone;
    this.bodyUser.sex = this.dataProfile.sex || 'O';
    this.bodyUser.birthDate = this.dataProfile.brithDate || '';
  }

  onChangeTypeDoc( fkTypeDoc: number ) {
    const finded = this.dataTypeDoc.find( td => Number( td.pkTypeDocument ) === Number( fkTypeDoc ) );
    if (!finded) {
      throw new Error( 'No se encontró registro ' );
    }

    this.longitudeTD = finded.longitude;
  }

  onChangeDocument() {

    if ( this.bodyUser.fkTypeDocument === 1 && this.bodyUser.document.length === 8 ) {
      this.loadingReniec = true;
      this.userSvc.onGetReniec( this.bodyUser.document ).subscribe( (res: IRespReniec) => {
        this.loadingReniec = false;
        if (!res) {
          console.log(' no encontrado');
          this.bodyUser.verifyReniec = false;
          return;
        }
        console.log(res);
        this.bodyUser.verifyReniec = true;
        this.bodyUser.name = res.nombres,
        this.bodyUser.surname = `${ res.apellido_paterno } ${ res.apellido_materno }`;
      });
    }
  }

  onSubmitProfile(frm: NgForm) {
    console.log(this.bodyUser);
    // tslint:disable-next-line: no-debugger
    // debugger;

    if (frm.valid) {
      this.loading = true;
      this.userSvc.onUpdateProfile( this.bodyUser ).subscribe( (res) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        if (this.fileProfile) {
          this.userSvc.onUpload( this.pkUser, this.fileProfile ).subscribe( (resUpload) => {
            if (!resUpload.ok) {
              throw new Error( resUpload.error );
            }


            this.dataProfile.img = resUpload.data[0].nameFile || '';
            this.fileProfile = null;
          });
        }

        this.loading = false;

        this.onShowAlert(
          res.showError === 0 ? 'success' : 'error',
          'Mensaje al usuario',
          this.onGetError( res.showError )
        );

        if (res.showError === 0) {
          this.bodyUser.onReset();
          this.onGetProfile();
          $('#btnCloseModalUser').trigger('click');
        }

      });
    }

  }

  onGetMessages() {
    this.msgSvc.onGetMessages( this.pkUser, 1, 10, true ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMsg = res.data;
      console.log(res);
    });
  }

  onGetError( showError: number ) {
    const arrMsg = showError === 0 ? ['Perfil actualizado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrMsg.push('no se encontro registro de usuario');
    }

    return arrMsg.join(', ');

  }

  onShowAlert( icon: SweetAlertIcon, title: string, text = '', backdrop = true ) {
    Swal.fire({
      title,
      icon,
      text,
      backdrop
    });
  }

  onSendMessage(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      this.bodyMessage.fkUserReceptor = this.dataProfile.pkUser;

      this.msgSvc.onAddMessage( this.bodyMessage ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loading = false;
        if (res.showError !== 0) {
          this.onShowAlert('error', 'Mensaje al usuario', this.onGetErrorMsg( res.showError ), false);

          return;
        }
        $('#btnCloseModalMg').trigger('click');
        this.onShowAlert('success', 'Mensaje al usuario', 'Mensaje enviado exitosamente');
        this.onGetMessages();
        if ( this.dataProfile.osId && this.dataProfile.osId !== '' ) {
          this.onSendPush( 'Nuevo mensaje', this.bodyMessage.message );
        }
        this.bodyMessage.onReset();
      });
    }
  }

  onSendPush( title = 'Mensaje al usuario', msg: string ) {
    this.osSbc = this.os.onSendPushUser( this.dataProfile.osId, title, msg ).subscribe( (res) => {
      console.log('respuesta one signal', res);
    });
  }

  onShowViewMsg( pkMessage: number ) {

    this.dataViewMsg = this.dataMsg.find( msg => msg.pkMessage === pkMessage );
    this.bodyResponse.pkMessage = this.dataViewMsg.pkMessage;
    this.bodyResponse.fkUserReceptor = this.dataProfile.pkUser;
    this.msgSvc.onGetResponseMsg( pkMessage ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMsgRes = res.data;
    });
    $('#btnShowViewMsgModal').trigger('click');
  }

  onSubmitMsgRes(frmMsgRes: NgForm) {
    if (frmMsgRes.valid) {

      this.loadingResponse = true;

      this.msgSvc.onAddMsgRes( this.bodyResponse ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loadingResponse = false;
        if (res.showError !== 0) {
          this.onShowAlert('error', 'Error',  this.onGetErrorMsgRes( res.showError ));
          return;
        }

        const finded = this.dataMsg.find( msg => msg.pkMessage === this.bodyResponse.pkMessage );
        finded.totalResponses += 1;
        const resRes: any = res.data;
        this.dataMsgRes.push({
            pkMessage: resRes.pkMessage,
            fkUserEmisor: 0,
            fkUserReceptor: this.dataProfile.pkUser,
            nameEmisor: resRes.nameEmisor,
            nameReceptor: resRes.nameReceptor,
            dateRegister: resRes.dateRegister,
            message: this.bodyResponse.message
        });

        this.onShowAlert('success', 'Mensaje al usuario', 'Mensaje enviado con éxito', false);

        this.newResponse = false;
        this.bodyResponse.message = '';
        if ( this.dataProfile.osId && this.dataProfile.osId !== '' ) {
          this.onSendPush( 'Nuevo mensaje', this.bodyResponse.message );
        }

      });
    }
  }

  onGetErrorMsg( showError: number ) {
    const arrError = showError === 0 ? ['Mensaje enviado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del emisor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('emisor inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('no se encontró registro del receptor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('receptor inactivo');
    }

    return arrError.join(', ');
  }

  onGetErrorMsgRes( showError: number ) {
    const arrError = showError === 0 ? ['Mensaje enviado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del mensaje');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('no se encontró registro del mensaje');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('emisor inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('no se encontró registro del receptor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 16) {
      arrError.push('receptor inactivo');
    }

    return arrError.join(', ');
  }

  onDisabledUser() {
    this.bodyDisabled.status = !this.dataProfile.statusRegister;
    this.actionDisabled = this.bodyDisabled.status ? 'habilitado' : 'des-habilitado';
    this.bodyDisabled.observation = `Usuario ${ this.actionDisabled } por ${ this.st.dataUser.nameComplete }`;
  }

  onSubmitDeleteUser() {
    this.loadingDisabled = true;
    this.userSvc.onDeleteUser( this.dataProfile.pkUser, this.bodyDisabled.status, this.bodyDisabled.observation ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.loadingDisabled = false;
      if (res.showError === 0) {
        this.dataProfile.statusRegister = !this.dataProfile.statusRegister;
        this.txtBtnDisabled = this.dataProfile.statusRegister ? 'Deshabilitar' : 'Habilitar';
        this.cssBtnDisabled = this.dataProfile.statusRegister ? 'danger' : 'success';
        this.iconBtnDisabled = this.dataProfile.statusRegister ? 'fa-user-times' : 'fa-user-check';
      }

      this.onShowAlert( res.showError === 0 ? 'success' : 'error', this.onGetErrorDelete( res.showError ) );
      $('#btnCloseConfirmUser').trigger('click');
    });
  }

  onGetErrorDelete( showError: number ) {
    const arrError = showError === 0 ? [`Usuario ${ this.actionDisabled } con éxito`] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del usuario');
    }

    return arrError.join(', ');
  }

  onChangeFileProfile(file: FileList) {

    this.fileProfile = file.item(0);
    const nombre = (file.item(0).name).toUpperCase();
    const arrNombre = nombre.split('.');
    const extension =  arrNombre[ arrNombre.length - 1 ] ;
    let msg = '';
    let verifyFile = true;
    console.log('ext img', extension);
    if ( !this.filesValid.includes( extension ) ) {
        msg = `Solo se aceptan archivos de tipo ${ this.filesValid.join(', ') }`;
        verifyFile = false;
    }

    if ( (file.item(0).size / 1000000 ) > 1 ) {
      msg = 'Solo se aceptar archivos con un tamaño máximo de 1 mb';
      verifyFile = false;
    }

    if (!verifyFile) {
      this.onShowAlert('warning', 'Alerta', msg);
      return;
    }

    console.log('cambiando imagen', file.item(0));
    this.loadingImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.bodyUser.img = event.target.result;
      this.loadingImg = false;
    };
    reader.readAsDataURL(this.fileProfile);
  }

  ngOnDestroy() {
    this.typeDocSbc.unsubscribe();
    if (this.osSbc) {
      this.osSbc.unsubscribe();
    }
  }

}
