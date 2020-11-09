import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigReferal } from 'src/app/models/configReferal.model';
import { ReferalService } from 'src/app/services/referal.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-config-referal',
  templateUrl: './config-referal.component.html',
  styleUrls: ['./config-referal.component.css']
})
export class ConfigReferalComponent implements OnInit, OnDestroy {

  configSbc: Subscription;
  updateSbc: Subscription;

  bodyReferal: ConfigReferal;
  loading = false;

  constructor( private rb: ReferalService ) { }

  ngOnInit(): void {

    this.bodyReferal = new ConfigReferal();
    this.onLoadConfig();

  }

  onLoadConfig() {
    Swal.fire({title: 'Espere...'});
    Swal.showLoading();
    this.configSbc = this.rb.onGetConfig().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyReferal.amountClient = res.data.amountClient || 0;
      this.bodyReferal.bonusCliRef = res.data.bonusCliRef || 0;
      this.bodyReferal.amountDriver = res.data.amountDriver || 0;
      this.bodyReferal.bonusDriRef = res.data.bonusDriRef || 0;
      this.bodyReferal.daysExpClient = res.data.daysExpClient || 0;
      this.bodyReferal.daysExpDriver = res.data.daysExpDriver || 0;
      Swal.close();

    });
  }

  onUpdate( frm: NgForm ) {

    if( frm.valid ) {

      this.loading = true;
      Swal.fire({title: 'Guardando...'});
      Swal.showLoading();
      this.updateSbc = this.rb.onUpdateConfig( this.bodyReferal ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        Swal.close();
        swal.fire('Mensaje al usuario', 'Se actualizó con éxito', 'success');
        this.loading = false;

      });
    }


  }

  ngOnDestroy() {
    this.configSbc.unsubscribe();

    if (this.updateSbc) {
      this.updateSbc.unsubscribe();
    }
  }

}
