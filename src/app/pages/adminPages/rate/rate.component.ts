import { Component, OnInit } from '@angular/core';
import { RateModel } from 'src/app/models/rate.model';
import { IRate } from 'src/app/interfaces/rate.interface';
import { RateService } from 'src/app/services/rate.service';
import { PagerService } from 'src/app/services/pager.service';
import { NgForm } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Rate',
  templateUrl: './Rate.component.html',
  styleUrls: [],
})
export class RateComponent implements OnInit {
  bodyRate: RateModel;
  dataRate: IRate[] = [];
  dataJournal: any[];
  dataCategory: any[];
  titleModal = 'Nueva tarifa';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  loadData = false;
  loading = false;

  constructor(private RateSvc: RateService, private pagerSvc: PagerService) {}

  ngOnInit() {
    this.bodyRate = new RateModel();
    this.onGetRate(1);
    this.onGetAllCategory();
    this.onGetAllJournal();
  }
  onGetAllCategory() {
    this.RateSvc.onGetListAllCategory().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataCategory = res.data;
    });
  }
  onGetAllJournal() {
    this.RateSvc.onGetListAllJournal().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataJournal = res.data;
    });
  }
  onGetRate(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.RateSvc.onGetListRate(page, 0, this.showInactive).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataRate = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataRate.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.RateSvc.onAddRate(this.bodyRate).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert('alertRateModal', css, icon, msg);
            return;
          } else {
            this.onShowAlert('alertRate', css, icon, msg);
          }

          $('#btnCloseModal').trigger('click');
          this.onGetRate(1);
        });

        return;
      }

      this.RateSvc.onUpdateRate(this.bodyRate).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert('alertRateModal', css, icon, msg);
          return;
        } else {
          this.onShowAlert('alertRate', css, icon, msg);
        }

        $('#btnCloseModal').trigger('click');
        this.onGetRate(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataRate.find((Rate) => Rate.pkRate === id);
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyRate.pkRate = finded.pkRate;
    this.bodyRate.fkCategory = finded.fkCategory;
    this.bodyRate.fkJournal = finded.fkJournal;
    this.bodyRate.priceRate = finded.priceRate;
    this.bodyRate.priceMin = finded.priceMin;


    this.titleModal = 'Editar tarifa';
    this.textButton = 'Guardar cambios';

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.RateSvc.onDeleteRate(this.bodyRate).subscribe((res) => {
      console.log('res');
      console.log(res);
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyRate.statusRegister ? 'restaurado' : 'eliminado';
      this.onShowAlert(
        'alertRate',
        css,
        icon,
        `Se ha ${action} un precio con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert('alertRateModal', css, icon, msg);
        return;
      }

      $('#btnCloseConfirm').trigger('click');
      this.onGetRate(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataRate.find((Rate) => Rate.pkRate === id);
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyRate.pkRate = finded.pkRate;
    this.bodyRate.statusRegister = !finded.statusRegister;
    this.actionConfirm = finded.statusRegister ? 'eliminar' : 'restaurar';
  }

  onShowAlert(idAlert: string, css: string, icon: string, msg: string) {
    let html = `<div class="alert alert-${css} alert-dismissible fade show" role="alert">`;
    html += `<span class="alert-icon"><i class="fa fa-${icon}"></i></span>`;
    html += `<span class="alert-text"> ${msg} </span>`;
    html += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    html += `<span aria-hidden="true">&times;</span>`;
    html += `</button>`;
    html += `</div>`;

    $(`#${idAlert}`).html(html);
  }

  onGetError(showError: number) {
    const css = showError === 0 ? 'success' : 'danger';
    const icon = showError === 0 ? 'check' : 'exclamation-circle';
    const action = this.loadData ? 'actualizado' : 'creado';
    const arrErr =
      showError === 0
        ? [`Se ha ${action} un precio con éxito`]
        : ['Error, ya existe un registro'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('con en esta categoria y jornada');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('se encuentra inactivo');
    }

    return { css, icon, msg: arrErr.join(', ') };
  }

  onReset() {
    $('#frmRate').trigger('reset');
    this.bodyRate.onReset();
    this.titleModal = 'Nuevo precio';
    this.textButton = 'Guardar';
    this.loadData = false;
  }
}
