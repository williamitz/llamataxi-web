export class VehicleVerifModel {

  pkVehicle: number;
  pkDriver: number;
  observation: string;
  numberPlate: string;
  year: number;
  imgFrontal: string;
  color: string;
  fkCategory: number;
  fkBrand: number;
  fkModel: number;

  constructor() {
    this.pkVehicle = 0;
    this.pkDriver = 0;
    this.observation = '';
    this.numberPlate = '';
    this.year = 0;
    this.imgFrontal = '';
    this.color = '';
    this.fkCategory = null;
    this.fkBrand = null;
    this.fkModel = null;
  }

  onReset() {
    this.pkVehicle = 0;
    this.pkDriver = 0;
    this.observation = '';
    this.numberPlate = '';
    this.year = 0;
    this.imgFrontal = '';
    this.color = '';
    this.fkCategory = null;
    this.fkBrand = null;
    this.fkModel = null;
  }
}
