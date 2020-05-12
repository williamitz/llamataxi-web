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
    this.fkTypeDocument = 0;
    this.fkNationality = 170;
    this.name = '';
    this.surname = '';
    this.document = '';

    this.email = '';
    this.phone = '';
    this.sex = 'M';
    this.google = false;
    this.verifyReniec = false;

    this.pkUser = 0;
    this.role = '';
    this.userName = '';
    this.userPassword = '';
    this.userPassRepit = '';

  }

}
