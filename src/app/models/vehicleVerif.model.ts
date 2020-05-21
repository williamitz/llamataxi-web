export class VehicleVerifModel {

  pkVehicle: number;
  pkDriver: number;
  observation: string;
  numberPlate: string;
  year: number;
  imgFrontal: string;
  color: string;
  fkCategory: string;
  fkBrand: string;
  fkModel: string;

  constructor() {
    this.pkVehicle = 0;
    this.pkDriver = 0;
    this.observation = '';
    this.numberPlate = '';
    this.year = 0;
    this.imgFrontal = '';
    this.color = '';
    this.fkCategory = '';
    this.fkBrand = '';
    this.fkModel = '';
  }

  onReset() {
    this.pkVehicle = 0;
    this.pkDriver = 0;
    this.observation = '';
    this.numberPlate = '';
    this.year = 0;
    this.imgFrontal = '';
    this.color = '';
    this.fkCategory = '';
    this.fkBrand = '';
    this.fkModel = '';
  }
}
