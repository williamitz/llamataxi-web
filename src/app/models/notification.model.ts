export class NotificationModel {
  pkNotification: number;
  fkUserEmisor: number;
  fkUserReceptor: number;
  notificationTitle: string;
  notificationSubTitle: string;
  notificationMessage: string;
  sended: number;
  dateSend: Date;
  readed?: number;
  dateReaded?: Date;
  statusRegister?: boolean;

  constructor() {
    this.pkNotification = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.notificationTitle = "";
    this.notificationSubTitle = "";
    this.notificationMessage = "";
    this.sended = 0;
    this.dateSend = new Date();
    this.readed = 0;
    this.dateReaded = new Date();
    this.statusRegister = true;
  }

  onReset() {
    this.pkNotification = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.notificationTitle = "";
    this.notificationSubTitle = "";
    this.notificationMessage = "";
    this.sended = 0;
    this.dateSend = new Date();
    this.readed = 0;
    this.dateReaded = new Date();
  }
}
