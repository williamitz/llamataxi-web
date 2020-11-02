import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IConfigJ } from 'src/app/interfaces/configJournal.interface';
import { ConfigJournalService } from 'src/app/services/config-journal.service';
import { PagerService } from 'src/app/services/pager.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CJournalModel } from '../../../models/configJournal.model';

@Component({
  selector: 'app-config-journal',
  templateUrl: './config-journal.component.html',
  styleUrls: ['./config-journal.component.css']
})
export class ConfigJournalComponent implements OnInit {

  cjListSbc: Subscription;
  cjAddSbc: Subscription;
  cjUpdateSbc: Subscription;
  cjDelSbc: Subscription;
  dataConfig: IConfigJ[] = [];
  bodyConfig: CJournalModel;

  loadingList = false;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };
  loadData = false;
  loading = false;
  showInactive = false;
  titleModal = 'Nuevo modo jornada';
  textButton = 'Guardar';
  actionConfirm = 'Eliminar';

  constructor( private cjSvc: ConfigJournalService, private pagerSvc: PagerService, private st: StorageService ) { }

  ngOnInit(): void {
    this.bodyConfig = new CJournalModel();
    this.st.onLoadToken();
    this.onGetConfig( 1 );
  }

  onGetConfig( page: number, chk = false ) {
    this.loadingList = true;
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.cjListSbc = this.cjSvc.onGetConfig( page, this.showInactive)
    .subscribe( (res) => {

        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataConfig = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend = (this.pagination.currentPage - 1) * 10 + this.dataConfig.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }

        this.loadingList = false;
      }
    );
  }

  onEdit( pk: number ) {
    const finded = this.dataConfig.find( conf => conf.pkConfigJournal === pk );
    if (finded) {
      this.bodyConfig.pkConfigJournal = pk;
      this.bodyConfig.name = finded.nameJournal;
      this.bodyConfig.rate = finded.rateJournal;
      this.bodyConfig.mode = finded.modeJournal;

      this.loadData = true;
      this.titleModal = 'Editar modo jornada';
      this.textButton = 'Guardar cambios';
    }
  }

  onConfirm( pk: number ) {
    const finded = this.dataConfig.find( conf => conf.pkConfigJournal === pk );
    if (finded) {
      this.bodyConfig.pkConfigJournal = pk;
      this.bodyConfig.mode = finded.modeJournal;
      this.bodyConfig.statusRegister = finded.statusRegister;
      this.actionConfirm = this.bodyConfig.statusRegister ? 'eliminar' : 'restaurar';
      this.bodyConfig.statusRegister = !finded.statusRegister;

      this.loadData = true;
    }
  }

  onSubmit( frm: NgForm ) {

    if (frm.valid) {

      Swal.fire({title: 'Espere...'});
      Swal.showLoading();
      if (!this.loadData) {

        this.cjAddSbc = this.cjSvc.onAddConfig( this.bodyConfig ).subscribe( (res) => {

          if ( !res.ok ) {
            throw new Error( res.error );
          }

          Swal.close();
          Swal.fire( this.onGetError( res.showError ) );

          if ( res.showError === 0 ) {

            this.onGetConfig(1);
            setTimeout(() => {
              $('#btnCloseModal').trigger('click');
            }, 500);
          }

        });

      } else {

        this.cjUpdateSbc = this.cjSvc.onUpdateConfig( this.bodyConfig ).subscribe( (res) => {

          if ( !res.ok ) {
            throw new Error( res.error );
          }

          Swal.close();
          Swal.fire( this.onGetError( res.showError ) );

          if ( res.showError === 0 ) {

            const finded = this.dataConfig.find( conf => conf.pkConfigJournal === this.bodyConfig.pkConfigJournal );
            if (finded) {
              finded.nameJournal = this.bodyConfig.name;
              finded.rateJournal = this.bodyConfig.rate;
              finded.modeJournal = this.bodyConfig.mode;
            }

            setTimeout(() => {
              $('#btnCloseModal').trigger('click');
            }, 500);
          }

        });

      }

    }


  }

  onDelete() {
    Swal.fire({title: 'Espere...'});
    Swal.showLoading();
    this.cjDelSbc = this.cjSvc.onDelConfig( this.bodyConfig )
    .subscribe( (res) => {

      if (!res.ok) {
        throw new Error(res.error);
      }

      Swal.close();
      Swal.fire( this.onGetErrorDel( res.showError ) );

      if ( res.showError === 0 ) {

        this.onGetConfig(1);

        setTimeout(() => {
          $('#btnCloseConfirm').trigger('click');
        }, 500);
      }
    });
  }

  onGetErrorDel( showError: number ) {
    const action = this.bodyConfig.statusRegister ? 'restaurado' : 'eliminado';
    const arrError = showError === 0 ? [`Modo jornada ${ action } con éxito`] : ['Error'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'error';

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró modo jornada');
    }

    return { title: 'Mensaje al usuario', html: arrError.join(', '), icon };

  }

  onReset() {
    this.bodyConfig.onReset();
    this.loadData = false;
    this.titleModal = 'Nuevo modo jornada';
    this.textButton = 'Guardar';
  }

  onGetError( showError: number ) {
    const action = this.loadData ? 'actualizado' : 'registrado';
    const arrError = showError === 0 ? [`Tipo jornada ${ action } con éxito`] : ['Error, ya existe un tipo de jornada'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'error';
    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('con este modo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('con esta tarifa');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('se encuentra inactivo');
    }

    return { title: 'Mensaje al usuario', html: arrError.join(', '), icon };

  }

}
