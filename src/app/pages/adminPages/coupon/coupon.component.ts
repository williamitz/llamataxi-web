import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICoupon } from 'src/app/interfaces/coupon.interface';
import { CouponModel } from 'src/app/models/coupon.model';
import { NgForm } from '@angular/forms';
import { CouponService } from 'src/app/services/coupon.service';
import { Subscription } from 'rxjs';
import { PagerService } from 'src/app/services/pager.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit, OnDestroy {

  cpListSbc: Subscription;
  cpAddSbc: Subscription;
  cpUpdateSbc: Subscription;
  cpDeleteSbc: Subscription;

  bodyCoupon: CouponModel;
  dataCoupon: ICoupon[] = [];
  dataCategory: any[];
  titleModal = 'Nuevo cupón';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;
  qCode = '';
  qRole = 'ALL';
  qTitle = '';
  qLte = 0;
  qGte = 0;
  qEq = 0;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  today = moment().set( 'days', 2 ).format('YYYY-MM-DD');

  loadData = false;
  loading = false;
  loadingList = false;

  constructor( private cpSvc: CouponService, private pagerSvc: PagerService  ) { }

  ngOnInit(): void {
    this.bodyCoupon = new CouponModel();
    this.bodyCoupon.dateExpiration = this.today;
    this.onGetCoupon(1);
  }

  onReset() {
    this.bodyCoupon.onReset();
    this.bodyCoupon.dateExpiration = this.today;
    this.loadData = false;
  }

  onSubmit( frm: NgForm ) {
    if (frm.valid) {
      Swal.fire({title: 'Espere...'});
      Swal.showLoading();
      if (!this.loadData) {
        this.cpAddSbc = this.cpSvc.onAddCoupon( this.bodyCoupon ).subscribe( (res) => {

          if (!res.ok) {
            throw new Error(res.error);
          }

          Swal.close();
          swal.fire( this.onGetError( res.showError ) );

          if ( res.showError === 0 ) {

            this.onGetCoupon(1);
            setTimeout(() => {
              $('#btnCloseModal').trigger('click');
            }, 500);
          }
        });
      } else {

        this.cpUpdateSbc = this.cpSvc.onUpdateCoupon( this.bodyCoupon ).subscribe( (res) => {

          if (!res.ok) {
            throw new Error(res.error);
          }

          Swal.close();
          swal.fire( this.onGetError( res.showError ) );

          if ( res.showError === 0 ) {

            const finded = this.dataCoupon.find( coupon => coupon.pkCoupon === this.bodyCoupon.pkCoupon );
            if (finded) {
              finded.titleCoupon = this.bodyCoupon.titleCoupon;
              finded.descriptionCoupon = this.bodyCoupon.descriptionCoupon;
              finded.codeCoupon = this.bodyCoupon.codeCoupon;
              finded.amountCoupon = this.bodyCoupon.amountCoupon;
              finded.minRateService = this.bodyCoupon.minRateService;
              finded.dateExpiration = moment( this.bodyCoupon.dateExpiration ).format('YYYY-MM-DD');
              finded.daysExpiration = this.bodyCoupon.daysExpiration;
              finded.roleCoupon = this.bodyCoupon.roleCoupon;

            }

            setTimeout(() => {
              $('#btnCloseModal').trigger('click');
            }, 500);
          }
        });

      }

    }
  }

  onGetError( showError: number ) {
    const action = this.loadData ? 'actualizado' : 'registrado';
    const arrError = showError === 0 ? [`Cupon ${ action } con éxito`] : ['Error'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'error';
    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('ya existe un cupón con este código');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('no se encontró cupón');
    }

    return { title: 'Mensaje al usuario', html: arrError.join(', '), icon };

  }

  onGetErrorDel( showError: number ) {
    const action = this.bodyCoupon.statusRegister ? 'restaurado' : 'eliminado';
    const arrError = showError === 0 ? [`Cupon ${ action } con éxito`] : ['Error'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'error';

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró cupón');
    }

    return { title: 'Mensaje al usuario', html: arrError.join(', '), icon };

  }

  onGetCoupon( page: number, chk = false ) {
    this.loadingList = true;
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.cpListSbc = this.cpSvc.onGetCoupon( page, this.qCode, this.qRole, this.qTitle,
                                          this.qLte, this.qGte, this.qEq,
                                          this.showInactive)
    .subscribe( (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataCoupon = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend = (this.pagination.currentPage - 1) * 10 + this.dataCoupon.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }

        this.loadingList = false;
      }
    );
  }

  onEdit( pk: number ) {
    const finded = this.dataCoupon.find( coupon => coupon.pkCoupon === pk );
    if (finded) {
      this.bodyCoupon.pkCoupon = pk;
      this.bodyCoupon.titleCoupon = finded.titleCoupon;
      this.bodyCoupon.descriptionCoupon = finded.descriptionCoupon;
      this.bodyCoupon.codeCoupon = finded.codeCoupon;
      this.bodyCoupon.amountCoupon = finded.amountCoupon;
      this.bodyCoupon.minRateService = finded.minRateService;
      this.bodyCoupon.dateExpiration = moment( finded.dateExpiration ).format('YYYY-MM-DD');
      this.bodyCoupon.daysExpiration = finded.daysExpiration;
      this.bodyCoupon.roleCoupon = finded.roleCoupon;

      this.loadData = true;
    }
  }

  onDelete() {
    Swal.fire({title: 'Espere...'});
    Swal.showLoading();
    this.cpDeleteSbc = this.cpSvc.onDeleteCoupon( this.bodyCoupon.pkCoupon, this.bodyCoupon.codeCoupon, this.bodyCoupon.statusRegister )
    .subscribe( (res) => {

      if (!res.ok) {
        throw new Error(res.error);
      }

      Swal.close();
      swal.fire( this.onGetErrorDel( res.showError ) );

      if ( res.showError === 0 ) {

        this.onGetCoupon(1);

        setTimeout(() => {
          $('#btnCloseConfirm').trigger('click');
        }, 500);
      }
    });
  }

  onConfirm( pk: number ) {
    const finded = this.dataCoupon.find( coupon => coupon.pkCoupon === pk );
    if (finded) {
      this.bodyCoupon.pkCoupon = pk;
      this.bodyCoupon.codeCoupon = finded.codeCoupon;
      this.bodyCoupon.statusRegister = finded.statusRegister;
      this.actionConfirm = this.bodyCoupon.statusRegister ? 'eliminar' : 'restaurar';
      this.bodyCoupon.statusRegister = !finded.statusRegister;

      this.loadData = true;
    }
  }

  ngOnDestroy() {
    this.cpListSbc.unsubscribe();

    if (this.cpAddSbc) {
      this.cpAddSbc.unsubscribe();
    }

    if (this.cpUpdateSbc) {
      this.cpUpdateSbc.unsubscribe();
    }

    if (this.cpDeleteSbc) {
      this.cpDeleteSbc.unsubscribe();
    }

  }

}
