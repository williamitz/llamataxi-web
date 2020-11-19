import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAwards } from 'src/app/interfaces/awards.interface';
import { AwardModel } from 'src/app/models/awards.model';
import { AwardsService } from 'src/app/services/awards.service';
import { PagerService } from 'src/app/services/pager.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';
import { IResponse } from '../../../interfaces/response.interface';
import * as $ from 'jquery';

const URL_BAK = environment.URL_SERVER;

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.css']
})
export class AwardsComponent implements OnInit, OnDestroy {

  listSbc: Subscription;
  uploadSbc: Subscription;
  addSbc: Subscription;
  updateSbc: Subscription;
  delSbc: Subscription;
  dataWards: IAwards[] = [];
  body: AwardModel;

  qName = '';
  showInactive = false;
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  titleModal = 'Nuevo premio';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  action = 'creado';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  imgAward = './assets/img/no-image.jpg';
  filesValid = ['PNG', 'JPG', 'JPEG'];
  fileProfile: File;

  pathImg = URL_BAK + `/Img/Get/award/`;

  loading = false;
  loadingImg = false;
  loadData = false;

  constructor( public st: StorageService, private awSvc: AwardsService, private pagerSvc: PagerService ) { }

  ngOnInit(): void {
    this.body = new AwardModel();

    this.st.onLoadToken();
    this.onGetAwards( 1 );

  }

  onGetAwards( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }

    this.listSbc = this.awSvc.onGetAward( page, this.rowsForPage, this.qName, this.showInactive )
    .subscribe( (res) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        this.dataWards = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * this.rowsForPage + 1;
          const vend =  (this.pagination.currentPage - 1) * this.rowsForPage + this.dataWards.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }

    });
  }

  onEdit( pk: number ) {
    const finded = this.dataWards.find( aw => aw.pkAward === pk );
    if (finded) {
      this.body.pkAward = pk;
      this.body.nameAward = finded.nameAward;
      this.body.description = finded.description;
      this.body.points = Number( finded.points );
      this.body.stock = Number( finded.stock );
      this.body.statusRegister = finded.statusRegister;

      this.imgAward = this.pathImg + `${ finded.img }?token=${ this.st.token }`;
      this.loadData = true;
      this.action = 'actualizado';
    }
  }

  onConfirm( pk: number ) {
    const finded = this.dataWards.find( aw => aw.pkAward === pk );
    if (finded) {
      this.body.pkAward = pk;
      this.body.statusRegister = !finded.statusRegister;
      this.action = finded.statusRegister ? 'eliminado' : 'restaurado';
      this.actionConfirm = finded.statusRegister ? 'eliminar' : 'restaurar';
    }
  }

  onDelete() {
    this.delSbc = this.awSvc.onDeleteAward( this.body ).subscribe( (res) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      Swal.fire( this.onGetError( res.showError ) );
      if (res.showError === 0) {

        if (this.fileProfile) {
          this.onUpdload( this.body.pkAward || 0 ).then( () => {
            this.fileProfile = null;
            this.onGetAwards( 1 );

          }).catch( e => console.error('error al subir imagen', e) );
        } else {
          this.onGetAwards( 1 );
        }

        $('#btnCloseConfirm').trigger('click');

      }

    });
  }

  onSubmit( frm: NgForm ) {
    if (frm.valid) {

      if (!this.loadData) {

        this.addSbc = this.awSvc.onAddAward( this.body ).subscribe( (res) => {

          if ( !res.ok ) {
            throw new Error( res.error );
          }

          Swal.fire( this.onGetError( res.showError ) );
          if (res.showError === 0) {

            
            if (this.fileProfile) {
              this.onUpdload( res.data.pkAward || 0 ).then( () => {
                this.fileProfile = null;
                this.onGetAwards( 1 );

              }).catch( e => console.error('error al subir imagen', e) );
            } else {
              this.onGetAwards( 1 );
            }

            $('#btnCloseModal').trigger('click');

          }

        });

      } else {
        this.updateSbc = this.awSvc.onUpdateAward( this.body ).subscribe( (res) => {

          if ( !res.ok ) {
            throw new Error( res.error );
          }

          Swal.fire( this.onGetError( res.showError ) );
          if (res.showError === 0) {

            if (this.fileProfile) {
              this.onUpdload( this.body.pkAward || 0 ).then( () => {
                this.fileProfile = null;
                this.onGetAwards( 1 );

              }).catch( e => console.error('error al subir imagen', e) );
            } else {
              this.onGetAwards( 1 );
            }

            $('#btnCloseModal').trigger('click');

          }

        });
      }

    }
  }

  onUpdload( pk: number ): Promise<IResponse> {

    return new Promise( (resolve, reject) => {

      this.uploadSbc = this.awSvc.onUpload( pk, this.fileProfile ).subscribe( (resUpload) => {
        if (!resUpload.ok) {
          reject( { ok: false, error: resUpload.error } );
        }

        resolve( { ok: true, data: resUpload} );
      });

    });
  }

  onReset() {
    this.body.onReset();
    this.imgAward = './assets/img/no-image.jpg';
    this.fileProfile = null;
    this.loadData = false;
    this.action = 'creado';
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
      return Swal.fire('Alerta!', msg, 'warning');
    }

    // console.log('cambiando imagen', file.item(0));
    this.loadingImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imgAward = event.target.result;
      this.loadingImg = false;
    };
    reader.readAsDataURL(this.fileProfile);
  }

  onGetError(showError: number) {
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'warning';
    // const action = this.loadData ? 'actualizado' : 'creado';
    const arrErr = showError === 0 ? [`Se ha ${this.action} un premio con éxito`] : ['Alerta'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('ya existe un premio con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrErr.push('no se encontró premio');
    }

    return { title: 'Mensaje al usuario', icon, text: arrErr.join(', ') };
  }

  ngOnDestroy() {
    if (this.listSbc) {
      this.listSbc.unsubscribe();
    }

    if (this.addSbc) {
      this.addSbc.unsubscribe();
    }

    if (this.updateSbc) {
      this.updateSbc.unsubscribe();
    }

    if (this.uploadSbc) {
      this.uploadSbc.unsubscribe();
    }
  }

}
