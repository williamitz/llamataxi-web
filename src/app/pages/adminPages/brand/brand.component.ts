import { Component, OnInit } from '@angular/core';
import { BrandModel } from 'src/app/models/brand.model';
import { IBrand } from 'src/app/interfaces/brand.interface';
import { BrandService } from 'src/app/services/brand.service';
import { PagerService } from 'src/app/services/pager.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent implements OnInit {
  bodyBrand: BrandModel;
  dataBrand: IBrand[] = [];
  dataCategory: any[];
  titleModal = 'Nuea Marca';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;
  qCategory = '';
  qBrand = '';
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  loadData = false;
  loading = false;

  constructor(private BrandSvc: BrandService, private pagerSvc: PagerService) {}

  ngOnInit() {
    this.bodyBrand = new BrandModel();
    this.onGetBrand(1);
    this.onGetAllCategory();
  }
  onGetAllCategory() {
    this.BrandSvc.onGetListAllCategory().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataCategory = res.data;
    });
  }
  onGetBrand(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.BrandSvc.onGetListBrand(page, this.qCategory, this.qBrand, this.showInactive).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataBrand = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataBrand.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.BrandSvc.onAddBrand(this.bodyBrand).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert("alertBrandModal", css, icon, msg);
            return;
          } else {
            this.onShowAlert("alertBrand", css, icon, msg);
          }

          $("#btnCloseModal").trigger("click");
          this.onGetBrand(1);
        });

        return;
      }

      this.BrandSvc.onUpdateBrand(this.bodyBrand).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert("alertBrandModal", css, icon, msg);
          return;
        } else {
          this.onShowAlert("alertBrand", css, icon, msg);
        }

        $("#btnCloseModal").trigger("click");
        this.onGetBrand(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataBrand.find((Brand) => Brand.pkBrand === id);
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyBrand.pkBrand = finded.pkBrand;
    this.bodyBrand.fkCategory = finded.fkCategory;
    this.bodyBrand.nameBrand = finded.nameBrand;

    this.titleModal = "Editar Marca";
    this.textButton = "Guardar cambios";

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.BrandSvc.onDeleteBrand(this.bodyBrand).subscribe((res) => {
      console.log("res");
      console.log(res);
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyBrand.statusRegister ? "restaurado" : "eliminado";
      this.onShowAlert(
        "alertBrand",
        css,
        icon,
        `Se ha ${action} una marca con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert("alertBrandModal", css, icon, msg);
        return;
      }

      $("#btnCloseConfirm").trigger("click");
      this.onGetBrand(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataBrand.find((Brand) => Brand.pkBrand === id);
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyBrand.pkBrand = finded.pkBrand;
    this.bodyBrand.statusRegister = !finded.statusRegister;
    this.actionConfirm = finded.statusRegister ? "eliminar" : "restaurar";
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
    const css = showError === 0 ? "success" : "danger";
    const icon = showError === 0 ? "check" : "exclamation-circle";
    const action = this.loadData ? "actualizado" : "creado";
    const arrErr =
      showError === 0
        ? [`Se ha ${action} una Marca con éxito`]
        : ["Error, ya existe un registro"];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push("con este nombre");
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push("se encuentra inactivo");
    }

    return { css, icon, msg: arrErr.join(", ") };
  }

  onReset() {
    $("#frmBrand").trigger("reset");
    this.bodyBrand.onReset();
    this.titleModal = "Nueva Marca";
    this.textButton = "Guardar";
    this.loadData = false;
  }
}
