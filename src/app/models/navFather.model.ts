export class NavFatherModel {
  pkNavFather: number;
  navFatherText: string;
  statusRegister?: boolean;

  constructor() {
    this.pkNavFather = 0;
    this.navFatherText = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkNavFather = 0;
    this.navFatherText = "";
  }
}
