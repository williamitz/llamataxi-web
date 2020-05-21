export interface IVehicleDriver {
  pkVehicleDriver: number;
  fkDriver: number;
  fkBrand: number;
  fkModel: number;
  isProper: number;
  imgLease: string;
  numberPlate: string;
  year: number;
  color: string;
  imgSoat: string;
  dateSoatExpiration: Date;
  imgPropertyCard: string;
  statusRegister?: number;
  verified?: boolean;
}
