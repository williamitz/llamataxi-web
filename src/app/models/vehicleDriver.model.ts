export class VehicleDriverModel {
  pkVehicleDriver: number;
  fkDriver: number;
  fkBrand: number;
  fkModel: number;
  isProper: number;
  imgLease: string;
  numberPlate: string;
  year: number;
  color: string;
  imgSoat: string;
  dateSoatExpiration: Date;
  imgPropertyCard: string;
  statusRegister?: boolean;

  constructor() {
    this.pkVehicleDriver = 0;
    this.fkDriver = 0;
    this.fkBrand = 0;
    this.fkModel = 0;
    this.isProper = 0;
    this.imgLease = "";
    this.numberPlate = "";
    this.year = 0;
    this.color = "";
    this.imgSoat = "";
    this.dateSoatExpiration = new Date();
    this.imgPropertyCard = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkVehicleDriver = 0;
    this.fkDriver = 0;
    this.fkBrand = 0;
    this.fkModel = 0;
    this.isProper = 0;
    this.imgLease = "";
    this.numberPlate = "";
    this.year = 0;
    this.color = "";
    this.imgSoat = "";
    this.dateSoatExpiration = new Date();
    this.imgPropertyCard = "";
  }
}
