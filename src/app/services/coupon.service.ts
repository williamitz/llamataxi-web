import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResponse } from '../interfaces/response.interface';
import { StorageService } from './storage.service';
import { CouponModel } from 'src/app/models/coupon.model';


const URI_API = environment.URL_SERVER;
@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor( private http: HttpClient, private st: StorageService ) { }

  onGetCoupon(page: number, qTitle = '', qLte = 0, qGte = 0, qEq = 0, showInactive: boolean ) {
    showInactive = showInactive ? false : true;
    this.st.onLoadToken();
    const qParams = `?page=${ page }&showInactive=${ showInactive }&qTitle=${ qTitle }&qLte=${ qLte }&qGte=${ qGte }&qEq=${ qEq }`;
    return this.http.get<IResponse>( URI_API + `/Coupon${ qParams }`, { headers: { Authorization: this.st.token }});
  }

  onAddCoupon( body: CouponModel ) {
    this.st.onLoadToken();
    return this.http.post<IResponse>( URI_API + `/Coupon/Add`, body, { headers: { Authorization: this.st.token }});
  }

}
