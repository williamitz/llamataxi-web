import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monitor-service',
  templateUrl: './monitor-service.component.html',
  styleUrls: ['./monitor-service.component.css']
})
export class MonitorServiceComponent implements OnInit {

  tokenMonitor = '';

  constructor( private router: ActivatedRoute ) { }

  ngOnInit(): void {

    this.tokenMonitor = String( this.router.snapshot.params.tokenMonitor ) || '';

  }

}
