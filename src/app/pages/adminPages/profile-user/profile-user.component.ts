import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { IUserProfile } from '../../../interfaces/user-profile.interface';
import { StorageService } from '../../../services/storage.service';
import { environment } from '../../../../environments/environment';
import { UserProfileModel } from '../../../models/user.model';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import * as $ from 'jquery';

const URL_BAK = environment.URL_SERVER;

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  pkUser = 0;

  dataProfile: IUserProfile = {
    pkUser: 0
  };

  bodyUser: UserProfileModel;

  dataTypeDoc: any[] = [];
  token = '';
  pathImg = '';

  //
  constructor(private router: ActivatedRoute, private userSvc: UserService, private st: StorageService) { }

  ngOnInit(): void {
    this.bodyUser = new UserProfileModel();
    this.st.onLoadToken();
    this.token = this.st.token;
    this.pkUser = Number( this.router.snapshot.params.id ) || 0;
    this.onGetProfile();
    this.onLoadTypeDoc();
  }

  onGetProfile() {
    this.userSvc.onGetProfile( this.pkUser ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data;
      this.pathImg = URL_BAK + '/User/Img/Get/' + this.dataProfile.img + `?token=${ this.token }`;

      console.log(res);
    });
  }

  onEditProfile() {
    this.bodyUser.pkUser = this.pkUser;
    this.bodyUser.fkTypeDocument = this.dataProfile.fkTypeDocument;
    this.bodyUser.document = this.dataProfile.document;
  }

  onLoadTypeDoc() {
    this.userSvc.onGetTypeDocumentAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeDoc = res.data;

    });
  }

  onSubmitProfile(frm: NgForm) {

    if (frm.valid) {
      this.userSvc.onUpdateProfile( this.bodyUser ).subscribe( (res) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        swal.fire({
          icon: res.showError === 0 ? 'success' : 'error',
          title: 'Mensaje al usuario',
          text: this.onGetError( res.showError )
        });

        if (res.showError === 0) {
          this.bodyUser.onReset();
          this.onGetProfile();
          $('#btnCloseModalUser').trigger('click');
        }

      });
    }

  }

  onGetError( showError: number ) {
    const arrMsg = showError === 0 ? ['Perfil actualizado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrMsg.push('no se encontro registro de usuario');
    }

    return arrMsg.join(', ');

  }

}
