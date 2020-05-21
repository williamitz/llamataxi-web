import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AllowUrlGuard implements CanActivate {

  constructor( private authSvc: AuthService, private router: Router ) {}

  canActivate( a: ActivatedRouteSnapshot  ): Promise<boolean> {
    const snap: any = a;
    const url: string = snap._routerState.url;
    let arrUrl = url.split('/');
    const param = arrUrl[ arrUrl.length - 1 ];
    if (! isNaN( Number( param )  ) ) {
      arrUrl[ arrUrl.length - 1 ] = null;
      arrUrl = arrUrl.filter( e => e !== null );
    }
    console.log(`${ arrUrl.join('/') }`);
    return new Promise( async (resolve) => {
      const res = await this.authSvc.onGetAllowMenu(  arrUrl.join('/') );

      if (!res) {
        this.router.navigateByUrl('/notFound');
        resolve(false);
      }

      resolve(true);
    });
  }
}
