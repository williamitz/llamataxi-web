import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = '';
  constructor( private router: ActivatedRoute ) { }

  ngOnInit() {

    // console.log(this.router.snapshot.data);
    this.title = this.router.snapshot.data.title;
  }

}
