import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestoreService } from 'src/app/services/restore.service';
import { RestoreModel } from '../../../models/restore.model';
import { retry } from 'rxjs/operators';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-restore-account',
  templateUrl: './restore-account.component.html',
  styleUrls: ['./restore-account.component.css']
})
export class RestoreAccountComponent implements OnInit, OnDestroy {

  restoreSbc: Subscription;

  tokenRestore = '';
  bodyRestore: RestoreModel;
  viewPsw = false;
  constructor( private router: ActivatedRoute, private restoreSvc: RestoreService ) { }

  ngOnInit(): void {
    this.bodyRestore = new RestoreModel();
    this.tokenRestore = String( this.router.snapshot.params.tokenRestore ) || '';
  }


  onRestore() {
    Swal.showLoading();
    this.restoreSbc = this.restoreSvc.onRestorePsw( this.bodyRestore , this.tokenRestore)
    .pipe( retry() )
    .subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      Swal.hideLoading();

      const { icon, text } = this.onGetError( res.showError );

      Swal.fire({
        title: 'Mensaje al usuario',
        text,
        icon
      });

    });
  }

  onGetError(showError: number) {
    const icon: SweetAlertIcon = showError === 0 ? 'success' : 'warning';
    const arrErr = showError === 0 ? [`Contraseña restaurada con éxito`] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('no se encontró usuario');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('su solicitud ha caducado');
    }

    return { icon, text: arrErr.join(', ') };
  }

  ngOnDestroy() {
    if (this.restoreSbc) {
      this.restoreSbc.unsubscribe();
    }
  }

}
