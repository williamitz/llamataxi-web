export interface INotification {
  pkNotification: number;
  fkUserEmisor: number;
  fkUserReceptor: number;
  notificationTitle: string;
  notificationSubTitle: string;
  notificationMessage: string;
  sended: number;
  dateSend: Date;
  readed: number;
  dateReaded: Date;
  statusRegister?: number;
}
