export interface IUserProfile {

  pkUser: number;
  fkTypeDocument?: number;
	fkNationality?: number;
  brithDate?: string;
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
  osId?: string;
  statusRegister?: boolean;
}

export interface IUserStorage {
  pkUser: number;
  pkPerson: number;
  userName: string;
  nameComplete: string;
  email: string;
  phone: string;
  img: string;
  role: string;
}
