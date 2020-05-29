import { PersonModel } from './person.models';
export class UserModel extends PersonModel {
  pkUser: number;
  role: string;
  userName: string;
  userPassword: string;
  userPassRepit: string;

  constructor() {
    super();
    this.pkPerson = 0;
    this.fkTypeDocument = 1;
    this.fkNationality = null;
    this.name = '';
    this.surname = '';
    this.document = '';

    this.email = '';
    this.phone = '';
    this.sex = 'M';
    this.google = false;
    this.verifyReniec = false;

    this.pkUser = 0;
    this.role = 'ADMIN_ROLE';
    this.userName = '';
    this.userPassword = '';
    this.userPassRepit = '';

  }

  onReset() {
    this.pkPerson = 0;
    this.fkTypeDocument = 1;
    this.fkNationality = null;
    this.name = '';
    this.surname = '';
    this.document = '';

    this.email = '';
    this.phone = '';
    this.sex = 'M';
    this.google = false;
    this.verifyReniec = false;

    this.pkUser = 0;
    this.role = 'ADMIN_ROLE';
    this.userName = '';
    this.userPassword = '';
    this.userPassRepit = '';
  }

}


export class UserProfileModel {

  pkUser: number;
  fkTypeDocument: number;
  document: string;

  constructor() {
    this.pkUser = 0;
    this.fkTypeDocument = null;
    this.document = '';
  }

  onReset() {
    this.pkUser = 0;
    this.fkTypeDocument = null;
    this.document = '';
  }

}

