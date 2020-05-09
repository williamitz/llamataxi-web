export class AppModel {
  pkApplication: number;
  nameApp: string;
  description: string;
  plattform: string;
  statusRegister?: boolean;

  constructor() {
    this.pkApplication = 0;
    this.nameApp = '';
    this.description = '';
    this.plattform = 'WEB';
    this.statusRegister = true;
  }

  onReset() {
    this.pkApplication = 0;
    this.nameApp = '';
    this.description = '';
    this.plattform = 'WEB';
  }
}
