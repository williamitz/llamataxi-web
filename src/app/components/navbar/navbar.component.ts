import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = '';
  dataUser: any = {};
  urlImg = environment.URL_SERVER + '/User/Img/Get/';
  token = '';

  constructor( private routerActive: ActivatedRoute, private storageSbvc: StorageService, private router: Router ) { }

  ngOnInit() {

    // console.log(this.router.snapshot.data);
    this.title = this.routerActive.snapshot.data.title;
    this.onLoadDataUser();
  }

  async onLoadDataUser() {
    this.dataUser = await this.storageSbvc.onGetItem('dataUser', true);
    this.storageSbvc.onLoadToken();
    this.token = `?token=${ this.storageSbvc.token }`;
  }

  onLogOut() {
    this.storageSbvc.onClear();
    this.router.navigateByUrl('/login');
  }

}
