export interface IDrivers {
  pkUser: number;
  lat: number;
  lng: number;
  occupied: boolean;
}

export interface IMarkerDriver {
  pkUser: number;
  occupied: boolean;
  marker: google.maps.Marker;
}


export interface IResCurrent {
  pkUser: number;
  coords: ICoords;
  occupied: boolean;
}


export interface ICoords {
  lat: number;
  lng: number;
}
