import { Component, OnInit } from "@angular/core";
import { NotificationModel } from "src/app/models/notification.model";
import { INotification } from "src/app/interfaces/notification.interface";
import { NotificationService } from "src/app/services/notification.service";
import { PagerService } from "src/app/services/pager.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-Notification",
  templateUrl: "./notification.component.html",
  styleUrls: [],
})
export class NotificationComponent implements OnInit {
  bodyNotification: NotificationModel;
  dataNotification: INotification[] = [];
  titleModal = "Nuevo Notification";
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
    private NotificationSvc: NotificationService,
    private pagerSvc: PagerService
  ) {}

  ngOnInit() {
    this.bodyNotification = new NotificationModel();
    this.onGetNotification(1);
  }

  onGetNotification(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.NotificationSvc.onGetListNotification(
      page,
      0,
      this.showInactive
    ).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.dataNotification = res.data;
      this.pagination = this.pagerSvc.getPager(res.total, page, 10);

      if (this.pagination.totalPages > 0) {
        const start = (this.pagination.currentPage - 1) * 10 + 1;
        const vend =
          (this.pagination.currentPage - 1) * 10 + this.dataNotification.length;
        this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
      }
    });
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.NotificationSvc.onAddNotification(this.bodyNotification).subscribe(
          (res) => {
            if (!res.ok) {
              throw new Error(res.error);
            }

            this.loading = false;
            const { css, icon, msg } = this.onGetError(res.showError);
            if (res.showError !== 0) {
              this.onShowAlert("alertNotificationModal", css, icon, msg);
              return;
            } else {
              this.onShowAlert("alertNotification", css, icon, msg);
            }

            $("#btnCloseModal").trigger("click");
            this.onGetNotification(1);
          }
        );

        return;
      }

      this.NotificationSvc.onUpdateNotification(
        this.bodyNotification
      ).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert("alertNotificationModal", css, icon, msg);
          return;
        } else {
          this.onShowAlert("alertNotification", css, icon, msg);
        }

        $("#btnCloseModal").trigger("click");
        this.onGetNotification(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataNotification.find(
      (Notification) => Notification.pkNotification === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyNotification.pkNotification = finded.pkNotification;
    this.bodyNotification.fkUserEmisor = finded.fkUserEmisor;
    this.bodyNotification.fkUserReceptor = finded.fkUserReceptor;
    this.bodyNotification.notificationTitle = finded.notificationTitle;
    this.bodyNotification.notificationSubTitle = finded.notificationSubTitle;
    this.bodyNotification.notificationMessage = finded.notificationMessage;
    this.bodyNotification.sended = finded.sended;
    this.bodyNotification.dateSend = finded.dateSend;
    this.bodyNotification.readed = finded.readed;
    this.bodyNotification.dateReaded = finded.dateReaded;

    this.titleModal = "Editar Notification";
    this.textButton = "Guardar cambios";

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.NotificationSvc.onDeleteNotification(this.bodyNotification).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);
        const action = this.bodyNotification.statusRegister
          ? "restaurado"
          : "eliminado";
        this.onShowAlert(
          "alertNotification",
          css,
          icon,
          `Se ha ${action} una notificación con éxito`
        );

        if (res.showError !== 0) {
          this.onShowAlert("alertNotificationModal", css, icon, msg);
          return;
        }

        $("#btnCloseConfirm").trigger("click");
        this.onGetNotification(1);
      }
    );
  }

  onConfirm(id: number) {
    const finded = this.dataNotification.find(
      (Notification) => Notification.pkNotification === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyNotification.pkNotification = finded.pkNotification;
    this.bodyNotification.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} una Notification con éxito`]
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
    $("#frmNotification").trigger("reset");
    this.bodyNotification.onReset();
    this.titleModal = "Nueva Notificación";
    this.textButton = "Guardar";
    this.loadData = false;
  }
}
