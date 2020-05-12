export interface IProfileDriver {
  brithDate?: Date;
  dateLicenseExpiration?: Date;
  dateVerified?: Date;
  document?: string;
  email?: string;
  fkUserVerified?: number;
  img?: string;
  imgCriminalRecord?: string;
  imgLicense?: string;
  imgPhotoCheck?: string;
  imgPolicialRecord?: string;
  isEmployee?: 0
  name?: string;
  nameComplete?: string;
  nameCountry?: string;
  nameDocument?: string;
  phone?: string;
  pkDriver?: number;
  pkPerson?: number;
  prefix?: string;
  prefixPhone?: string;
  surname?: string;
  userName?: string;
  verified?: number;
  verifyReniec?: number;
  yearsOld?: number;
}
