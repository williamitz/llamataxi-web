export class RestoreModel {

  password: string;
  passwordRepit: string;

  constructor() {
    this.password = '';
    this.passwordRepit = '';

  }

  onReset() {
    this.password = '';
    this.passwordRepit = '';
  }
}
