import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  title = '';
  constructor( private router: ActivatedRoute ) { }

  ngOnInit() {
    // this.title = this.router.data;
    console.log(this.router.snapshot.data);
  }

  onTitle(title) {
    console.log(title);
  }

}
