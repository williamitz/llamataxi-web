export interface IDrivers {
  pkUser: number;
  lat: number;
  lng: number;
  nameComplete: string;
  occupied: boolean;
  codeCategory: string;
}

export interface IMarkerDriver {
  pkUser: number;
  occupied: boolean;
  marker: google.maps.Marker;
  codeCategory?: string;
}


export interface IResCurrent {
  pkUser: number;
  coords: ICoords;
  occupied: boolean;
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