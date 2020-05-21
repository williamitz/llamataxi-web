import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanLoad {
  constructor(private router: Router) {}
  canLoad(): boolean {
    if (!localStorage.getItem('token') || localStorage.getItem('token') === '') {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}
