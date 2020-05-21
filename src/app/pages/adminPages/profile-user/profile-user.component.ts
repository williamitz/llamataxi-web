import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { IUserProfile } from '../../../interfaces/user-profile.interface';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  pkUser = 0;
  userSbc: Subscription;
  dataProfile: IUserProfile = {
    pkUser: 0
  };
  constructor(private router: ActivatedRoute, private userSvc: UserService) { }

  ngOnInit(): void {
    this.pkUser = Number( this.router.snapshot.params.id ) || 0;
    this.onGetProfile();
  }

  onGetProfile() {
    this.userSbc = this.userSvc.onGetProfile( this.pkUser ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data;
      console.log(res);
    });
  }

  ngOnDestroy() {
    this.userSbc.unsubscribe();
  }

}
