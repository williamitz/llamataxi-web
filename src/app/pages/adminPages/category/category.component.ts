import { Component, OnInit } from "@angular/core";
import { CategoryModel } from "src/app/models/category.model";
import { ICategory } from "src/app/interfaces/category.interface";
import { CategoryService } from "src/app/services/category.service";
import { PagerService } from "src/app/services/pager.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-Category",
  templateUrl: "./category.component.html",
  styleUrls: [],
})
export class CategoryComponent implements OnInit {
  bodyCategory: CategoryModel;
  dataCategory: ICategory[] = [];
  titleModal = "Nuevo Categoria";
  textButton = "Guardar";
  actionConfirm = "eliminar";
  showInactive = false;

  infoPagination = "Mostrando 0 de 0 registros.";
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  loadData = false;
  loading = false;

  constructor(
    private CategorySvc: CategoryService,
    private pagerSvc: PagerService
  ) {}

  ngOnInit() {
    this.bodyCategory = new CategoryModel();
    this.onGetCategory(1);
  }

  onGetCategory(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.CategorySvc.onGetListCategory(page, 0, this.showInactive).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.dataCategory = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataCategory.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.CategorySvc.onAddCategory(this.bodyCategory).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert("alertCategoryModal", css, icon, msg);
            return;
          } else {
            this.onShowAlert("alertCategory", css, icon, msg);
          }

          $("#btnCloseModal").trigger("click");
          this.onGetCategory(1);
        });

        return;
      }

      this.CategorySvc.onUpdateCategory(this.bodyCategory).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert("alertCategoryModal", css, icon, msg);
          return;
        } else {
          this.onShowAlert("alertCategory", css, icon, msg);
        }

        $("#btnCloseModal").trigger("click");
        this.onGetCategory(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataCategory.find(
      (Category) => Category.pkCategory === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyCategory.pkCategory = finded.pkCategory;
    this.bodyCategory.nameCategory = finded.nameCategory;

    this.titleModal = "Editar Categoria";
    this.textButton = "Guardar cambios";

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.CategorySvc.onDeleteCategory(this.bodyCategory).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyCategory.statusRegister
        ? "restaurado"
        : "eliminado";
      this.onShowAlert(
        "alertCategory",
        css,
        icon,
        `Se ha ${action} una aplicacion con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert("alertCategoryModal", css, icon, msg);
        return;
      }

      $("#btnCloseConfirm").trigger("click");
      this.onGetCategory(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataCategory.find(
      (Category) => Category.pkCategory === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyCategory.pkCategory = finded.pkCategory;
    this.bodyCategory.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} una Category con éxito`]
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
    $("#frmCategory").trigger("reset");
    this.bodyCategory.onReset();
    this.titleModal = "Nueva aplicación";
    this.textButton = "Guardar";
    this.loadData = false;
  }
}
