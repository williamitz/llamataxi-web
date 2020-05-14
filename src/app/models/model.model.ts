export class ModelModel {
  pkModel: number;
  fkCategory: number;
  fkBrand: number;
  nameModel: string;
  statusRegister?: boolean;

  constructor() {
    this.pkModel = 0;
    this.fkCategory = 0;
    this.fkBrand = 0;
    this.nameModel = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkModel = 0;
    this.fkCategory = 0;
    this.fkBrand = 0;
    this.nameModel = "";
  }
}
