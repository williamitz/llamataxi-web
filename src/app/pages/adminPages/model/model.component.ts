import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModelModel } from 'src/app/models/model.model';
import { IModel } from 'src/app/interfaces/model.interface';
import { ModelService } from 'src/app/services/model.service';
import { PagerService } from 'src/app/services/pager.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Model',
  templateUrl: './model.component.html',
  styleUrls: [],
})
export class ModelComponent implements OnInit, OnDestroy {
  bodyModel: ModelModel;
  dataModel: IModel[] = [];
  dataCategory: any[];
  dataBrand: any[];
  titleModal = 'Nuevo Modelo';
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

  categorySbc: Subscription;
  brandSbc: Subscription;
  modelSbc: Subscription;

  qCategory = '';
  qBrand = '';
  qModel = '';

  constructor(private ModelSvc: ModelService, private pagerSvc: PagerService) {}

  ngOnInit() {
    this.bodyModel = new ModelModel();
    this.onGetAllCategory();
    this.onGetModel(1);
    // this.onGetAllBrand();
  }

  onGetAllCategory() {
    this.categorySbc = this.ModelSvc.onGetListAllCategory().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      console.log('categories', res);
      this.dataCategory = res.data;
    });
  }

  onGetAllBrand() {
    this.brandSbc = this.ModelSvc.onGetListAllBrand( this.bodyModel.fkCategory ).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataBrand = res.data;
    });
  }

  onChangueCategory() {
    this.onGetAllBrand();
  }

  onGetModel(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.modelSbc = this.ModelSvc.onGetListModel(page, this.qCategory, this.qBrand, this.qModel, this.showInactive).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataModel = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataModel.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.ModelSvc.onAddModel(this.bodyModel).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert('alertModelModal', css, icon, msg);
            return;
          } else {
            this.onShowAlert('alertModel', css, icon, msg);
          }

          $('#btnCloseModal').trigger('click');
          this.onGetModel(1);
        });

        return;
      }

      this.ModelSvc.onUpdateModel(this.bodyModel).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert('alertModelModal', css, icon, msg);
          return;
        } else {
          this.onShowAlert('alertModel', css, icon, msg);
        }

        $('#btnCloseModal').trigger('click');
        this.onGetModel(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataModel.find((Model) => Model.pkModel === id);
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyModel.pkModel = finded.pkModel;
    this.bodyModel.fkCategory = finded.fkCategory;
    this.bodyModel.fkBrand = finded.fkBrand;
    this.bodyModel.nameModel = finded.nameModel;

    this.onGetAllBrand();

    this.titleModal = 'Editar Modelo';
    this.textButton = 'Guardar cambios';

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.ModelSvc.onDeleteModel(this.bodyModel).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyModel.statusRegister ? 'restaurado' : 'eliminado';
      this.onShowAlert(
        'alertModel',
        css,
        icon,
        `Se ha ${action} un modelo con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert('alertModelModal', css, icon, msg);
        return;
      }

      $('#btnCloseConfirm').trigger('click');
      this.onGetModel(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataModel.find((Model) => Model.pkModel === id);
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyModel.pkModel = finded.pkModel;
    this.bodyModel.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} un Modelo con éxito`]
        : ['Error, ya existe un registro'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrErr.push('no se encontró registro');
    }

    return { css, icon, msg: arrErr.join(', ') };
  }

  onReset() {
    $('#frmModel').trigger('reset');
    this.bodyModel.onReset();
    this.titleModal = 'Nuevo Modelo';
    this.textButton = 'Guardar';
    this.loadData = false;
  }

  ngOnDestroy() {
    this.categorySbc.unsubscribe();
    this.modelSbc.unsubscribe();

    if (this.brandSbc) {
      this.brandSbc.unsubscribe();
    }
  }
}
