import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../../models/login.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

import { StorageService } from '../../../services/storage.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  bodyLogin: LoginModel;

  constructor(private authSvc: AuthService, private storageSvc: StorageService, private router: Router) { }

  ngOnInit() {
    this.bodyLogin = new LoginModel();
  }

  onLoginSubmit( frm: NgForm ) {
    if (frm.valid) {

      this.authSvc.onLogin( this.bodyLogin ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        if (res.showError !== 0) {
          const { css, msg } = this.onGetError( res.showError );
          swal.fire({
            title: 'Mensaje al usuario',
            text: msg,
            icon: 'warning',
            // buttons: ['Ok']
          });

          return;

        }

        this.storageSvc.onSaveCredentials( res.token, res.data );

        this.router.navigateByUrl('/admin');

        console.log(res);
      });
      console.log(this.bodyLogin);
    }
  }

  onGetError( showError: number ) {
    const css = showError === 0 ? 'success' : 'error';
    let arrError = showError !== 0 ? ['Error'] : [''];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError = ['Usuario o contraseña incorrectos'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError = ['Usuario o contraseña incorrectos'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('Usuario no verificado');
    }

    return {css, msg: arrError.join(', ')};
  }

}
