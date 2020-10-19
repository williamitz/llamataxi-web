import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styles: [
    `
    .error-box {
      height: 100%;
      position: fixed;
      background: url(../../../assets/images/background/error-bg.jpg) no-repeat center center #fff;
      width: 100%;
    }
    .error-box .footer {
      width: 100%;
      left: 0px;
      right: 0px;
    }

    .error-body {
      padding-top: 5%;
    }
    .error-body h1 {
      font-size: 210px;
      font-weight: 900;
      text-shadow: 4px 4px 0 #ffffff, 6px 6px 0 #263238;
      line-height: 210px
    }

    .spaceman {
      transform: rotate(35deg);
    }

    `
  ]
})
export class NotFoundComponent implements OnInit {

  currentYear = moment().year();

  constructor() { }

  ngOnInit() {
  }

}
