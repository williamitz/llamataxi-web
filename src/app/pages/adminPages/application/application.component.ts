import { Component, OnInit } from '@angular/core';
import { AppModel } from '../../../models/application.model';
import { ApplicationService } from '../../../services/application.service';
import { IApplication } from '../../../interfaces/application.interface';
import { PagerService } from '../../../services/pager.service';
import * as $ from 'jquery';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})

export class ApplicationComponent implements OnInit {

  bodyApp: AppModel;
  dataApp: IApplication[] = [];
  titleModal = 'Nueva aplicación';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  loadData = false;
  loading = false;

  constructor(private appSvc: ApplicationService, private pagerSvc: PagerService) { }

  ngOnInit() {
    this.bodyApp = new AppModel();
    this.onGetApplication(1);
  }

  onGetApplication( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.appSvc.onGetListApp( page, '', this.showInactive ).subscribe( (res) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataApp = res.data;
      this.pagination = this.pagerSvc.getPager(res.total, page, 10);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * 10) + 1;
        const vend = ((this.pagination.currentPage - 1) * 10) + this.dataApp.length;
        this.infoPagination = `Mostrando del ${ start } al ${ vend } de ${ res.total } registros.`;
      }

    });
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {

      this.loading = true;
      if (this.loadData === false) {

        this.appSvc.onAddApp( this.bodyApp ).subscribe( (res) => {
          if (!res.ok) {
            throw new Error( res.error );
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError( res.showError );

          if (res.showError !== 0) {
            this.onShowAlert( 'alertAppModal', css, icon, msg );
            return;
          } else {
            this.onShowAlert( 'alertApp', css, icon, msg );
          }

          $('#btnCloseModal').trigger('click');
          this.onGetApplication( 1 );

        });

        return;
      }

      this.appSvc.onUpdateApp( this.bodyApp ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError( res.showError );

        if (res.showError !== 0) {
          this.onShowAlert( 'alertAppModal', css, icon, msg );
          return;
        } else {

          this.onShowAlert( 'alertApp', css, icon, msg );

        }

        $('#btnCloseModal').trigger('click');
        this.onGetApplication( 1 );

      });

    }
  }

  onEdit( id: number ){
    const finded = this.dataApp.find( app => app.pkApplication === id );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyApp.pkApplication = finded.pkApplication;
    this.bodyApp.nameApp = finded.nameApp;
    this.bodyApp.plattform = finded.plattform;
    this.bodyApp.description = finded.description;

    this.titleModal = 'Editar aplicación';
    this.textButton = 'Guardar cambios';

    this.loadData = true;

  }

  onDelete() {
    this.loading = true;

    this.appSvc.onDeleteApp( this.bodyApp ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError( res.showError );
      const action = this.bodyApp.statusRegister ? 'restaurado' : 'eliminado';
      this.onShowAlert( 'alertApp', css, icon, `Se ha ${ action } una aplicacion con éxito` );

      if (res.showError !== 0) {
        this.onShowAlert( 'alertAppModal', css, icon, msg );
        return;
      }

      $('#btnCloseConfirm').trigger('click');
      this.onGetApplication( 1 );
    });
  }

  onConfirm( id: number ) {
    const finded = this.dataApp.find( app => app.pkApplication === id );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyApp.pkApplication = finded.pkApplication;
    this.bodyApp.statusRegister = !finded.statusRegister;
    this.actionConfirm = finded.statusRegister ? 'eliminar' : 'restaurar';
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

  onGetError( showError: number ) {
    const css = showError === 0 ? 'success' : 'danger';
    const icon = showError === 0 ? 'check' : 'exclamation-circle';
    const action = this.loadData ? 'actualizado' : 'creado';
    const arrErr = showError === 0 ? [`Se ha ${ action } una app con éxito`] : ['Error, ya existe un registro'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('se encuentra inactivo');
    }

    return { css, icon, msg: arrErr.join(', ') };

  }

  onReset() {
    $('#frmApp').trigger('reset');
    this.bodyApp.onReset();
    this.titleModal = 'Nueva aplicación';
    this.textButton = 'Guardar';
    this.loadData = false;
  }

}
