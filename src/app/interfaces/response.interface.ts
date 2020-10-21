export interface IResponse {

  ok: boolean;
  data?: any;
  total?: number;
  error?: any;
  showError?: number;
  token?: string;
  newFile?: string;
  message?: string;

}


export interface ICoorsIO {
  lat: number;
  lng: number;
}
