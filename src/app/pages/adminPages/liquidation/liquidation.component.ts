import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { find } from 'rxjs/operators';
import IJournalIO from 'src/app/interfaces/journal-socket.interface';
import { IAccountDriver, IJournalDriver } from 'src/app/interfaces/liquidation.interface';
import { LiquidationService } from 'src/app/services/liquidation.service';
import { PagerService } from 'src/app/services/pager.service';
import { SocketService } from 'src/app/services/socket.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { IServiceJournal, LiquidationModel } from '../../../models/liquidation.model';
import { UiService } from '../../../services/ui.service';
import { NgForm } from '@angular/forms';
import { SweetAlertIcon } from 'sweetalert2';

const URI_API = environment.URL_SERVER;

@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidationComponent implements OnInit, OnDestroy {

  listSbc: Subscription;
  accountSbc: Subscription;
  servicesSbc: Subscription;
  addLiqui: Subscription;
  ioCloseSbc: Subscription;

  dataLiquidation: IJournalDriver[] = [];
  accountDriver: IAccountDriver[] = [];
  servicesDriver: IServiceJournal[] = [];
  body: LiquidationModel;
  titleModal = 'Nuea Marca';
  textButton = 'Liquidar';
  actionConfirm = 'eliminar';
  showInactive = false;
  rowsForPage = 10;
  qCategory = '';
  infoPagination = 'Mostrando 0 de 0 registros.';
  infoPaginationServices = '0 registros';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  paginationServices = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  pathImg = URI_API + `/User/Img/Get/`;

  loadData = false;
  loading = false;
  pageServices = 1;
  // tslint:disable-next-line: max-line-length
  constructor( private liqSvc: LiquidationService, private pagerSvc: PagerService, public st: StorageService, private io: SocketService, private ui: UiService ) { }

  ngOnInit(): void {

    this.st.onLoadToken();
    this.onGetLiquidation(1);
    this.onListenClose();
    this.body = new LiquidationModel();

  }

  onListenClose() {
    this.ioCloseSbc = this.io.onListen( 'close-journal' ).subscribe( (res: IJournalIO) => {

      this.onGetLiquidation( 1 );

    });
  }

  onEdit( pk: number ) {

  }

  onConfirm( pk: number ) {

  }

  onGetLiquidation( page: number, chk = false ) {

    if (chk) {
      this.showInactive = !this.showInactive;
    }

    this.listSbc = this.liqSvc.onGetJournal( page, this.rowsForPage, this.qCategory, this.showInactive )
    .subscribe( (res) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        this.dataLiquidation = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * this.rowsForPage + 1;
          const vend =  (this.pagination.currentPage - 1) * this.rowsForPage + this.dataLiquidation.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }

    });

  }

  onReset() {
    this.body.onReset();
    this.pageServices = 1;
  }

  onNewLiquided( pk: number ) {
    const finded = this.dataLiquidation.find( rec => rec.pkJournalDriver === pk );
    if (finded) {

      Swal.fire({title: 'Espere...'});
      Swal.showLoading();

      this.body.nameComplete = finded.nameComplete;
      this.body.img = finded.img;
      this.body.fkJournalDriver = pk;
      // this.body.amount = finded.totalCredit + finded.totalDiscount;
      this.body.fkDriver = finded.fkDriver;
      this.body.codeJournal = finded.codeJournal;
      this.body.dateStart = finded.dateStart;
      this.body.dateEnd = finded.dateEnd;
      this.body.nameJournal = finded.nameJournal;
      this.body.rateJournal = finded.rateJournal;
      this.body.totalDebt = finded.totalDebt;
      this.body.totalPay = finded.totalPay;
      this.body.paidOut = !finded.paidOut;

      this.body.totalLiquidation = (finded.totalCard + finded.totalCredit + finded.totalDiscount);
      if (!finded.paidOut) {
        this.body.amountCompany = ( finded.totalDebt + finded.totalPay );
        this.body.totalLiquidation -= ( finded.totalDebt + finded.totalPay );
      }

      this.onLoadAccounts();
      this.onLoadServicesDetail();
    }
  }

  onLoadAccounts() {
    this.accountSbc = this.liqSvc.onGetAccountDriver( this.body.fkDriver )
    .subscribe( (res) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.accountDriver = res.data;

    });
  }

  onLoadServicesDetail() {
    this.servicesSbc = this.liqSvc.onGetServices(  this.pageServices, this.body.fkDriver, this.body.fkJournalDriver, this.body.codeJournal )
    .subscribe( (res) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.servicesDriver = res.data;
      this.paginationServices = this.pagerSvc.getPager(res.total, this.pageServices, 5);
      this.infoPaginationServices = `${res.total} registros`;
      Swal.close();
    });
  }

  onSubmit( frm: NgForm ) {

    if (frm.valid) {
      Swal.fire({text: 'Espere...'});
      Swal.showLoading();
      this.addLiqui = this.liqSvc.onAddLiquidation( this.body ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        Swal.close();

        Swal.fire( this.onGetError( res.showError ) );
        if (condition) {
          
        }

      });
    }

  }

  onGetError( showError: number ) {
    let arrError = showError === 0 ? ['Se ha creado una liquidación con éxito'] : ['Alerta!'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'warning';
    // tslint:disable-next-line: no-bitwise
    if (  showError & 1 ) {
      arrError.push('esta jornada aún esta abierta');
    }

    // tslint:disable-next-line: no-bitwise
    if (  showError & 2 ) {
      arrError = ['Alerta!', 'esta jornada ya tiene una liquidación'];
    }

    // tslint:disable-next-line: no-bitwise
    if (  showError & 4 ) {
      arrError = ['Alerta!', 'ya existe una liquidación con este número de operación'];
    }

    // tslint:disable-next-line: no-bitwise
    if (  showError & 8 ) {
      arrError = ['Alerta!', 'esta cuenta bancaría está inactiva'];
    }

    // tslint:disable-next-line: no-bitwise
    if (  showError & 16 ) {
      arrError = ['Alerta!', 'no se encontró jornada'];
    }

    // tslint:disable-next-line: no-bitwise
    if (  showError & 32 ) {
      arrError = ['Alerta!', 'no se encontró conductor'];
    }

    // tslint:disable-next-line: no-bitwise
    if (  showError & 64 ) {
      arrError = ['Alerta!', 'no se encontró cuenta bancaria'];
    }

    return { title: 'Mensaje al usuaio', html: arrError.join(', '), icon };


  }

  ngOnDestroy() {
    if (this.ioCloseSbc) {
      this.ioCloseSbc.unsubscribe();
    }

    if (this.listSbc) {
      this.listSbc.unsubscribe();
    }
  }

}
