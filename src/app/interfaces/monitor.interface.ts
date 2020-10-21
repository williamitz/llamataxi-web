export interface IDrivers {
  pkUser: number;
  lat: number;
  lng: number;
  nameComplete: string;
  occupied: boolean;
  codeCategory: string;
}

export interface IClient {
  pkUser: number;
  lat: number;
  lng: number;
  nameComplete: string;
  codeCategory: string;
}

export interface IMarkerDriver {
  pkUser: number;
  occupied: boolean;
  marker: google.maps.Marker;
  codeCategory?: string;
}

export interface IMarkerClient {
  pkUser: number;
  marker: google.maps.Marker;
  codeCategory?: string;
  nameComplete?: string;
}

export interface IResCurrent {
  pkUser: number;
  coords: ICoords;
  occupied?: boolean;
  nameComplete: string;
  codeCategory: string;
}


export interface ICoords {
  lat: number;
  lng: number;
}

export interface IZoneDemand {
  indexHex: string;
  total: number;
  totalDrivers: number;
  polygon: number[][];
  center: number[];
}

export interface IPolygons {
  indexHex: string;
  totalServices: number;
  totalDrivers: number;
  polygon: google.maps.Polygon;
  color: string;
}

export interface IServiceSocket {
  data: any;
  polygon: number[][];
  center: number[];
  indexHex: string;
  totalDrivers: number;
}

export interface IDisposal {
  pkService?: number;
  msg?: string;
  indexHex: string;
  pkClient: number;
}

export interface IServiceMonitor {
  abduzcan: number;
  nameClient: string;
  imgClient: string;
  documentClient?: string;
  typeDocClient?: string;
  nameDriver: string;
  imgDriver: string;
  documentDriver?: string;
  typeDocDriver?: string;

  latOrigin?: number;
  lngOrigin?: number;
  latDestination?: number;
  lngDestination?: number;
  streetOrigin: string;
  streetDestination: string;
  distanceText: string;
  minutesText: string;
  paymentType?: string;
  rateOffer?: number;

  numberPlate?: string;
  year?: string;
  color?: string;
  aliasCategory?: string;

  imgTaxiFrontal?: string;
  nameModel?: string;
  nameBrand?: string;

  runOrigin?: boolean;
  finishOrigin?: boolean;
  runDestination?: boolean;
  finishDestination?: boolean;
  dateRunOrigin?: string;
  dateFinishOrigin?: string;
  dateRunDestination?: string;
  dateFinishDestination?: string;
}
