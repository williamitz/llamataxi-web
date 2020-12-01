export class ProfileModel {
  name: string;
  surname: string;
  nameComplete: string;
  document: string;
  fkTypeDocument: number;
  email: string;
  phone: string;
  prefixPhone: string;
  fkNationality: number;
  aboutMe: string;

  constructor(){
    this.name = '';
    this.surname = '';
    this.nameComplete = '';
    this.document = '';
    this.fkTypeDocument = 0;
    this.email = '';
    this.phone = '';
    this.prefixPhone = '+51';
    this.fkNationality = 0;
    this.aboutMe = '';
  }

  onReset() {
    this.name = '';
    this.surname = '';
    this.nameComplete = '';
    this.document = '';
    this.fkTypeDocument = 0;
    this.email = '';
    this.phone = '';
    this.prefixPhone = '+51';
    this.fkNationality = 0;
    this.aboutMe = '';
  }

}
