export class BrandModel {
  pkBrand: number;
  fkCategory: number;
  nameBrand: string;
  statusRegister?: boolean;

  constructor() {
    this.pkBrand = 0;
    this.fkCategory = 0;
    this.nameBrand = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkBrand = 0;
    this.fkCategory = 0;
    this.nameBrand = "";
  }
}
