export class CategoryModel {
  pkCategory?: number;
  nameCategory: string;
  statusRegister?: boolean;

  constructor() {
    this.pkCategory = 0;
    this.nameCategory = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkCategory = 0;
    this.nameCategory = "";
  }
}
