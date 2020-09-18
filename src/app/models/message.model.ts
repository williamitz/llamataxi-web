export class MessageModel {

  pkMessage: number;
  fkUserEmisor: number;
  fkUserReceptor: number;
  subject: string;
  message: string;
  tags: string;
  isDriver: boolean;

  dateRegister: string;
  readed: boolean;
  dateReaded: string;

  nameEmisor: string;
  userEmisor: string;
  nameReceptor: string;
  imgEmisor: string;
  imgReceptor: string;
  totalResponses: number;
  totalResponseNoReaded: number;
  sliceLength: number;
  showMore: boolean;

  constructor(isDriver: boolean) {
    this.pkMessage = 0;
    this.fkUserEmisor = 0;
    this.fkUserReceptor = 0;
    this.subject = '';
    this.message = '';
    this.tags = '';
    this.isDriver = isDriver;

    this.dateRegister = '';
    this.readed = false;
    this.dateReaded = '';

    this.nameEmisor = '';
    this.userEmisor = '';
    this.nameReceptor = '';
    this.imgEmisor = '';
    this.imgReceptor = '';
    this.totalResponses = 0;
    this.totalResponseNoReaded = 0;
    this.sliceLength = 30;
    this.showMore = false;
  }

  onReset() {
    this.pkMessage = 0;
    // this.fkUserEmisor = 0;
    // this.fkUserReceptor = 0;
    this.subject = '';
    this.message = '';
  }

}
