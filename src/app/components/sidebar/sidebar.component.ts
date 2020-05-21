import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { IMenu } from '../../interfaces/menuRole.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuSbc: Subscription;
  dataMenu: IMenu[] = [];

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    this.onGetMenu();
  }

  onGetMenu() {
    this.menuSbc = this.authSvc.onGetMenu().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.dataMenu = res.data;

    });
  }

  ngOnDestroy() {
    this.menuSbc.unsubscribe();
  }
}
