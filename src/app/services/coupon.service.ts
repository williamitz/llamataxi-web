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

  onGetCoupon(page: number, qCode = '', qRole = '', qTitle = '', qLte = 0, qGte = 0, qEq = 0, showInactive: boolean ) {
    showInactive = showInactive ? false : true;
    this.st.onLoadToken();
    let qParams = `?page=${ page }`;
    qParams += `&showInactive=${ showInactive }`;
    qParams += `&qTitle=${ qTitle }`;
    qParams += `&qLte=${ qLte }`;
    qParams += `&qGte=${ qGte }`;
    qParams += `&qEq=${ qEq }`;
    qParams += `&qCode=${ qCode }`;
    qParams += `&qRole=${ qRole }`;

    return this.http.get<IResponse>( URI_API + `/Coupon${ qParams }`, { headers: { Authorization: this.st.token }});
  }

  onAddCoupon( body: CouponModel ) {
    this.st.onLoadToken();
    return this.http.post<IResponse>( URI_API + `/Coupon/Add`, body, { headers: { Authorization: this.st.token }});
  }

  onUpdateCoupon( body: CouponModel ) {
    this.st.onLoadToken();
    return this.http.put<IResponse>( URI_API + `/Coupon/${ body.pkCoupon }`, body,
    { headers: { Authorization: this.st.token }});
  }

  onDeleteCoupon( pk: number, code: string, status: boolean ) {
    this.st.onLoadToken();
    return this.http.delete<IResponse>( URI_API + `/Coupon/${ pk }/${ code }/${ status }`,
    { headers: { Authorization: this.st.token }});
  }

}
