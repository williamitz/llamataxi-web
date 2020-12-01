export default interface IProfile {
  name: string;
  surname: string;
  nameComplete: string;
  document: string;
  fkTypeDocument: number;
  email: string;
  phone: string;
  prefixPhone: string;
  fkNationality: number;
  role: string;
  userName: string;
  aboutMe: string;
  img: string;
}
