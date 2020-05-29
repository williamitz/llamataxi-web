export interface IUserProfile {

  pkUser: number;
  fkTypeDocument?: number;
	fkNationality?: number;
  brithDate?: Date;
  dateVerified?: Date;
  document?: string;
  email?: string;
  fkUserVerified?: number;
  img?: string;

  sex?: string;
  name?: string;
  nameComplete?: string;
  nameCountry?: string;
  nameDocument?: string;
  phone?: string;
  pkPerson?: number;
  prefix?: string;
  prefixPhone?: string;
  surname?: string;
  userName?: string;
  verified?: number;
  verifyReniec?: number;
  yearsOld?: number;

}
