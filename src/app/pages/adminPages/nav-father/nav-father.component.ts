import { Component, OnInit } from "@angular/core";
import { NavFatherModel } from "src/app/models/navFather.model";
import { INavFather } from "src/app/interfaces/navFather.interface";
import { NavFatherService } from "src/app/services/navFather.service";
import { PagerService } from "src/app/services/pager.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-nav-father",
  templateUrl: "./nav-father.component.html",
  styleUrls: [],
})
export class NavFatherComponent implements OnInit {
  bodyNavFather: NavFatherModel;
  dataNavFather: INavFather[] = [];
  titleModal = "Nuevo Nav Father";
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
    private NavFatherSvc: NavFatherService,
    private pagerSvc: PagerService
  ) {}

  ngOnInit() {
    this.bodyNavFather = new NavFatherModel();
    this.onGetNavFather(1);
  }

  onGetNavFather(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.NavFatherSvc.onGetListNavFather(page, "", this.showInactive).subscribe(
      (res) => {
        console.log("res");
        console.log(res);
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataNavFather = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataNavFather.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.NavFatherSvc.onAddNavFather(this.bodyNavFather).subscribe(
          (res) => {
            if (!res.ok) {
              throw new Error(res.error);
            }

            this.loading = false;
            const { css, icon, msg } = this.onGetError(res.showError);
            if (res.showError !== 0) {
              this.onShowAlert("alertNavFatherModal", css, icon, msg);
              return;
            } else {
              this.onShowAlert("alertNavFather", css, icon, msg);
            }

            $("#btnCloseModal").trigger("click");
            this.onGetNavFather(1);
          }
        );

        return;
      }

      this.NavFatherSvc.onUpdateNavFather(this.bodyNavFather).subscribe(
        (res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);

          if (res.showError !== 0) {
            this.onShowAlert("alertNavFatherModal", css, icon, msg);
            return;
          } else {
            this.onShowAlert("alertNavFather", css, icon, msg);
          }

          $("#btnCloseModal").trigger("click");
          this.onGetNavFather(1);
        }
      );
    }
  }

  onEdit(id: number) {
    const finded = this.dataNavFather.find(
      (NavFather) => NavFather.pkNavFather === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyNavFather.pkNavFather = finded.pkNavFather;
    this.bodyNavFather.navFatherText = finded.navFatherText;

    this.titleModal = "Editar Nav Father";
    this.textButton = "Guardar cambios";

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.NavFatherSvc.onDeleteNavFather(this.bodyNavFather).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyNavFather.statusRegister
        ? "restaurado"
        : "eliminado";
      this.onShowAlert(
        "alertNavFather",
        css,
        icon,
        `Se ha ${action} una aplicacion con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert("alertNavFatherModal", css, icon, msg);
        return;
      }

      $("#btnCloseConfirm").trigger("click");
      this.onGetNavFather(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataNavFather.find(
      (NavFather) => NavFather.pkNavFather === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyNavFather.pkNavFather = finded.pkNavFather;
    this.bodyNavFather.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} una NavFather con éxito`]
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
    $("#frmNavFather").trigger("reset");
    this.bodyNavFather.onReset();
    this.titleModal = "Nueva aplicación";
    this.textButton = "Guardar";
    this.loadData = false;
  }
}
