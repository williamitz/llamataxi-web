import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';

const URI_API = environment.URL_SERVER;

@Component({
  selector: 'app-profile-driver',
  templateUrl: './profile-driver.component.html',
  styleUrls: ['./profile-driver.component.css']
})
export class ProfileDriverComponent implements OnInit {

  pathImg = URI_API + `/User/Img/Get/`;
  token = '';

  dataProfile: any = {
    img: ''
  };

  constructor(private router: ActivatedRoute, private driverSvc: DriverService, private storage: StorageService) { }

  ngOnInit() {
    this.storage.onLoadToken();
    this.token = `?token=${ this.storage.token }`;
    console.log(this.router.snapshot.params.id);
    this.onGetProfile( this.router.snapshot.params.id || 0 );
    // console.log(this.router.snapshot.data);
  }

  onGetProfile( id: number ) {
    this.driverSvc.onGetProfile( id ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data[0].profile;
      console.log(res);
      console.log(this.dataProfile.img);
    });
  }

}
