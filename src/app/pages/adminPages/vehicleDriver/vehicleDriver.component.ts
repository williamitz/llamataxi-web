import { Component, OnInit } from "@angular/core";
import { VehicleDriverModel } from "src/app/models/vehicleDriver.model";
import { IVehicleDriver } from "src/app/interfaces/vehicleDriver.interface";
import { VehicleDriverService } from "src/app/services/vehicleDriver.service";
import { PagerService } from "src/app/services/pager.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-VehicleDriver",
  templateUrl: "./vehicleDriver.component.html",
  styleUrls: [],
})
export class VehicleDriverComponent implements OnInit {
  bodyVehicleDriver: VehicleDriverModel;
  dataVehicleDriver: IVehicleDriver[] = [];
  dataDriver: any[];
  dataBrand: any[];
  dataModel: any[];
  titleModal = "Nuevo Vehículo";
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
    private VehicleDriverSvc: VehicleDriverService,
    private pagerSvc: PagerService
  ) {}

  ngOnInit() {
    this.bodyVehicleDriver = new VehicleDriverModel();
    this.onGetVehicleDriver(1);
    this.onGetAllDriver();
    this.onGetAllBrand();
    this.onGetAllModel();
  }
  onGetAllDriver() {
    this.VehicleDriverSvc.onGetListAllDriver().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataDriver = res.data;
    });
  }
  onGetAllBrand() {
    this.VehicleDriverSvc.onGetListAllBrand().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataBrand = res.data;
    });
  }
  onGetAllModel() {
    this.VehicleDriverSvc.onGetListAllModel().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataModel = res.data;
    });
  }
  onGetVehicleDriver(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.VehicleDriverSvc.onGetListVehicleDriver(
      page,
      0,
      this.showInactive
    ).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.dataVehicleDriver = res.data;
      this.pagination = this.pagerSvc.getPager(res.total, page, 10);

      if (this.pagination.totalPages > 0) {
        const start = (this.pagination.currentPage - 1) * 10 + 1;
        const vend =
          (this.pagination.currentPage - 1) * 10 +
          this.dataVehicleDriver.length;
        this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
      }
    });
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.VehicleDriverSvc.onAddVehicleDriver(
          this.bodyVehicleDriver
        ).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert("alertVehicleDriverModal", css, icon, msg);
            return;
          } else {
            this.onShowAlert("alertVehicleDriver", css, icon, msg);
          }

          $("#btnCloseModal").trigger("click");
          this.onGetVehicleDriver(1);
        });

        return;
      }

      this.VehicleDriverSvc.onUpdateVehicleDriver(
        this.bodyVehicleDriver
      ).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert("alertVehicleDriverModal", css, icon, msg);
          return;
        } else {
          this.onShowAlert("alertVehicleDriver", css, icon, msg);
        }

        $("#btnCloseModal").trigger("click");
        this.onGetVehicleDriver(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataVehicleDriver.find(
      (VehicleDriver) => VehicleDriver.pkVehicleDriver === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyVehicleDriver.pkVehicleDriver = finded.pkVehicleDriver;
    this.bodyVehicleDriver.fkDriver = finded.fkDriver;
    this.bodyVehicleDriver.fkBrand = finded.fkBrand;
    this.bodyVehicleDriver.fkModel = finded.fkModel;
    this.bodyVehicleDriver.isProper = finded.isProper;
    this.bodyVehicleDriver.imgLease = finded.imgLease;
    this.bodyVehicleDriver.numberPlate = finded.numberPlate;
    this.bodyVehicleDriver.year = finded.year;
    this.bodyVehicleDriver.color = finded.color;
    this.bodyVehicleDriver.imgSoat = finded.imgSoat;
    this.bodyVehicleDriver.dateSoatExpiration = finded.dateSoatExpiration;
    this.bodyVehicleDriver.imgPropertyCard = finded.imgPropertyCard;

    this.titleModal = "Editar Vehículo";
    this.textButton = "Guardar cambios";

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.VehicleDriverSvc.onDeleteVehicleDriver(
      this.bodyVehicleDriver
    ).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyVehicleDriver.statusRegister
        ? "restaurado"
        : "eliminado";
      this.onShowAlert(
        "alertVehicleDriver",
        css,
        icon,
        `Se ha ${action} un vehículo con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert("alertVehicleDriverModal", css, icon, msg);
        return;
      }

      $("#btnCloseConfirm").trigger("click");
      this.onGetVehicleDriver(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataVehicleDriver.find(
      (VehicleDriver) => VehicleDriver.pkVehicleDriver === id
    );
    if (!finded) {
      console.error("No se encontro registro!!!");
      return;
    }

    this.bodyVehicleDriver.pkVehicleDriver = finded.pkVehicleDriver;
    this.bodyVehicleDriver.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} una Vehículo con éxito`]
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
    $("#frmVehicleDriver").trigger("reset");
    this.bodyVehicleDriver.onReset();
    this.titleModal = "Nuevo Vehículo";
    this.textButton = "Guardar";
    this.loadData = false;
  }
}
