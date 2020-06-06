export abstract class PersonModel {
  pkPerson: number;
  fkTypeDocument: number;
  fkNationality?: number;
  name: string;
  surname: string;
  document: string;
  birthDate?: string;
  email: string;
  phone: string;
  sex: string;
  img?: string;
  google?: boolean;
  verifyReniec?: boolean;
}
