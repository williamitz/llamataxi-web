export interface IVehicle {
  pkVehicle?: number;
  fkCategory?: number;
  fkBrand?: number;
  fkModel?: number;
  color?: string;
  dateRegister?: Date;
  dateSoatExpiration?: string;
  imgPropertyCard: string;
  imgSoat?: string;
  imgTaxiBack?: string;
  imgTaxiFrontal?: string;
  imgTaxiInterior?: string;
  isProper?: number;
  numberPlate?: string;
  year?: number;
  verified?: number;
  statusRegister?: boolean;
}
