export class MessageModel {

  pkMessage: number;
  fkUserEmisor: number;
  fkUserReceptor: number;
  subject: string;
  message: string;

  constructor() {
    this.pkMessage = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.subject = '';
    this.message = '';
  }

  onReset() {
    this.pkMessage = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.subject = '';
    this.message = '';
  }

}
