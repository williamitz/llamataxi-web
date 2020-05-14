export class MessageModel {

  pkMessage: number;
  fkUserEmisor: number;
  fkUserReceptor: number;
  subject: string;
  message: string;
  tags: string;
  isDriver: boolean;

  constructor(isDriver: boolean) {
    this.pkMessage = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.subject = '';
    this.message = '';
    this.tags = '';
    this.isDriver = isDriver;
  }

  onReset() {
    this.pkMessage = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.subject = '';
    this.message = '';
  }

}
