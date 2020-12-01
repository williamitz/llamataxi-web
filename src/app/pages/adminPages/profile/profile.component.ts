import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { INationality } from 'src/app/interfaces/nationality.interface';
import IProfile from 'src/app/interfaces/profile.interface';
import { ITypeDocument } from 'src/app/interfaces/type-document.interface';
import { ProfileModel } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment.prod';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { IResponse } from '../../../interfaces/response.interface';

const URL_BAK = environment.URL_SERVER;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  getSbc: Subscription;
  countrySbc: Subscription;
  typeDocSbc: Subscription;
  uploadSbc: Subscription;

  dataProfile: IProfile = {
    name: '',
    surname: '',
    nameComplete: '',
    document: '',
    fkTypeDocument: 1,
    email: '',
    phone: '',
    prefixPhone: '+51',
    fkNationality: 170,
    role: '',
    userName: '',
    img: '',
    aboutMe: ''
  };
  filesValid = ['PNG', 'JPG', 'JPEG'];
  dataNationality: INationality[] = [];
  longitudeTD = 8;

  dataTypeDoc: ITypeDocument[] = [];

  body: ProfileModel;

  pathImg = URL_BAK + `/User/Img/Get/`;
  fileProfile: File;
  loadingImg = false;
  loading = false;

  constructor( public st: StorageService, private profSvc: ProfileService, private userSvc: UserService ) { }

  ngOnInit(): void {
    this.body = new ProfileModel();
    this.st.onLoadToken();
    this.st.onLoadData();
    this.onLoadNationality();
    this.onLoadTypeDoc();
    this.onLoadProfile();
  }

  onLoadNationality() {
    this.countrySbc = this.userSvc.onGetNationalityAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;
    });
  }

  onLoadTypeDoc() {
    this.typeDocSbc = this.userSvc.onGetTypeDocumentAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeDoc = res.data;

    });
  }

  onLoadProfile() {
    Swal.fire({text: 'Espere...'});
    Swal.showLoading();
    this.getSbc = this.profSvc.onGetProfile().subscribe( (res) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data;

      this.dataProfile.img = this.pathImg + res.data.img + `?token=${ this.st.token }`;

      Swal.close();

    });
  }

  onShowModal() {
    this.body.name = this.dataProfile.name;
    this.body.surname = this.dataProfile.surname;
    this.body.nameComplete = this.dataProfile.nameComplete;
    this.body.email = this.dataProfile.email;
    this.body.phone = this.dataProfile.phone;
    this.body.document = this.dataProfile.document;
    this.body.fkTypeDocument = this.dataProfile.fkTypeDocument;
    this.body.fkNationality = this.dataProfile.fkNationality;
    this.body.prefixPhone = this.dataProfile.prefixPhone;
  }

  onReset() {
    this.body.onReset();
    $('#frmProfile').trigger('reset');
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
      Swal.fire( 'Alerta!',  msg, 'warning');
      return;
    }

    console.log('cambiando imagen', file.item(0));
    this.loadingImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.dataProfile.img = event.target.result;
      this.loadingImg = false;
    };
    reader.readAsDataURL(this.fileProfile);
  }

  onSubmitProfile( frm: NgForm ) {

    if (frm.valid) {
      this.loading = true;
      this.profSvc.onUpdateProfile( this.body )
      .subscribe( async(res) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        if (this.fileProfile) {
          const resUpload = await this.onUpload();

          if (resUpload.ok) {
            this.dataProfile.img = resUpload.data[0].nameFile || '';
            this.st.dataUser.img = this.dataProfile.img;
            this.fileProfile = null;
          }
        }

        this.loading = false;

        Swal.fire({
          title: 'Alerta!',
          html: this.onGetError( res.showError ),
          icon: res.showError === 0 ? 'success' : 'warning'
        });

        if (res.showError === 0) {

          this.st.dataUser.nameComplete = `${ this.body.surname }, ${ this.body.name }`;
          this.st.dataUser.email = this.body.email;

          this.st.onSetItem( 'dataUser', this.st.dataUser, true );

          this.body.onReset();
          this.onLoadProfile();
          $('#btnCloseModalUser').trigger('click');
        }

      });
    }



  }

  onChangeTypeDoc( fkTypeDoc: number ) {
    const finded = this.dataTypeDoc.find( td => Number( td.pkTypeDocument ) === Number( fkTypeDoc ) );
    if (!finded) {
      throw new Error( 'No se encontró registro ' );
    }

    this.longitudeTD = finded.longitude;
  }

  onUpload(): Promise<IResponse> {
    return new Promise( (resolve) => {

      this.uploadSbc = this.userSvc.onUpload( this.st.dataUser.pkUser, this.fileProfile )
      .subscribe( (res) => {
        if (!res.ok) {
          resolve({ok: false, error: res.error});
        }


        resolve({ok: true, data: res.data});
      });

    });
  }

  onGetError( showError: number ) {
    let arrMsg = showError === 0 ? ['Perfil actualizado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrMsg = ['Alerta!', 'no se encontro registro de usuario'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrMsg.push('usuario inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 3) {
      arrMsg.push('ya existe otro usuario con este email');
    }

    return arrMsg.join(', ');

  }

  ngOnDestroy() {

    if (this.getSbc) {
      this.getSbc.unsubscribe();
    }

    this.countrySbc.unsubscribe();
    this.typeDocSbc.unsubscribe();

  }

}
