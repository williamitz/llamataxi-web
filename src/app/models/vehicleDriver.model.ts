export class VehicleDriverModel {
  pkVehicle: number;
  fkDriver: number;
  fkPerson: number;
  fkCategory: number;
  fkBrand: number;
  fkModel: number;
  isProper: number;
  verified: number;
  numberPlate: string;
  year: number;
  color: string;
  dateSoatExpiration: string;
  statusRegister?: boolean;

  constructor(pkDriver: number) {
    this.pkVehicle = 0;
    this.fkDriver = pkDriver;
    this.fkPerson = 0;
    this.fkCategory = null;
    this.fkBrand = null;
    this.fkModel = null;
    this.isProper = 1;
    this.verified = 1;
    this.numberPlate = '';
    this.year = null;
    this.color = 'BLACK';
    this.dateSoatExpiration = '';
    this.statusRegister = true;
  }

  onReset() {
    this.pkVehicle = 0;
    this.fkCategory = null;
    this.fkBrand = null;
    this.fkModel = null;
    this.isProper = 1;
    this.verified = 1;
    this.numberPlate = '';
    this.year = null;
    this.color = 'BLACK';

    this.dateSoatExpiration = '';
  }
}
