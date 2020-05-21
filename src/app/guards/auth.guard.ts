import { Injectable } from '@angular/core';
import { CanLoad, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor( private authSvc: AuthService, private router: Router ) {}

  canLoad(): Promise<boolean> {
    return new Promise( async (resolve) => {

      const res = await this.authSvc.onAuthToken();
      if (!res) {
        this.router.navigateByUrl('/login');
        resolve(false);
      }

      resolve(true);
    });
  }
}
