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

  today = moment().set( 'day', 2 ).format('YYYY-MM-DD');

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
        });
      }

    }
  }

  onGetError( showError: number ) {
    const arrError = showError === 0 ? ['Cupon registrado con éxito'] : ['Error'];
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'error';
    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('ya existe un cupón con este código');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('se encuentra inactivo');
    }

    return { title: 'Mensaje al usuario', html: arrError.join(', '), icon };

  }

  onGetCoupon( page: number, chk = false ) {
    this.loadingList = true;
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.cpListSbc = this.cpSvc.onGetCoupon(page, this.qTitle, this.qLte, this.qGte, this.qEq, this.showInactive)
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

  }

  onDelete() {

  }

  onConfirm( pk: number ) {

  }

  ngOnDestroy() {
    this.cpListSbc.unsubscribe();
  }

}
