export interface IResponse {

  ok: boolean;
  data?: any[];
  total?: number;
  error?: any;
  showError?: number;
  token?: string;
  newFile?: string;

}
