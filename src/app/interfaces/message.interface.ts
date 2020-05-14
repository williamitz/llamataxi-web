export interface IMsg {
  pkMessage: number;
  dateRegister?: string;
  fkUserEmisor?: number;
  fkUserReceptor?: number;
  imgEmisor?: string;
  imgReceptor?: string;
  message?: string;
  nameEmisor?: string;
  userEmisor?: string;
  nameReceptor?: string;
  subject?: string;
  tags?: string;
  totalResponses?: number;
}
