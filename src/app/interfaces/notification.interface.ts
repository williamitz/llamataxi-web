export interface INotification {
  pkNotification: number;
  fkUserEmisor: number;
  fkUserReceptor?: number;
  notificationTitle: string;
  notificationSubTitle: string;
  notificationMessage: string;
  sended?: number;
  dateSend: Date;
  readed: number;
  dateReaded?: Date;
  statusRegister?: number;

  nameComplete?: string;
  img?: string;
  urlShow?: string;
}


export interface INotiSocket {
  dataUser?: any;
  title: string;
  subtitle: string;
  message: string;
  urlShow: string;
}
