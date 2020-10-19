import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IServiceMonitor } from 'src/app/interfaces/monitor.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MonitorService } from '../../../services/monitor.service';

@Component({
  selector: 'app-monitor-service',
  templateUrl: './monitor-service.component.html',
  styleUrls: ['./monitor-service.component.css']
})
export class MonitorServiceComponent implements OnInit {

  @ViewChild( 'mapMonitor', {static: true} ) mapMonitor: ElementRef;

  sbcInfo: Subscription;
  dataService: IServiceMonitor = {
    nameClient: 'lorem ipsum dolor',
    nameDriver: 'lorem ipsum dolor',
    imgClient: 'xD.png',
    imgDriver: 'xD.png',
    distanceText: '15km',
    minutesText: '25min',
    streetDestination: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi unde labore commodi nam adipisci autem natus harum.',
    streetOrigin: 'Tempore eius in, minus aut error culpa dignissimos, harum nisi impedit, illum quas.',
    dateRunOrigin: '2020-08-07 16:30:57',
    dateFinishOrigin: '2020-08-07 16:30:57',
    dateRunDestination: '2020-08-07 16:30:57',
    dateFinishDestination: '2020-08-07 16:30:57'
  };
  tokenMonitor = '';
  codJournal = '';

  map: google.maps.Map;

  constructor( private routerAct: ActivatedRoute, private router: Router, private monitorSvc: MonitorService ) { }

  ngOnInit(  ): void {
    this.tokenMonitor = String( this.routerAct.snapshot.params.tokenMonitor ) || 'xD';
    this.onLoadMap();
    // this.onLoadInfo();
  }

  onLoadMap() {

    const styles: any = this.codJournal === 'DIURN' ? environment.styleMapDiurn : environment.styleMapDiurn;

    const optMap: google.maps.MapOptions = {
      center: new google.maps.LatLng( -12.054825, -77.040627 ),
      zoom: 13.5,
      streetViewControl: false,
      // disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles
    };

    this.map = new google.maps.Map( this.mapMonitor.nativeElement, optMap);

  }

  onLoadInfo() {

    Swal.showLoading();

    this.sbcInfo = this.monitorSvc.onGetInfoService( this.tokenMonitor ).subscribe( (res) => {
      if (!res.ok) {
        Swal.hideLoading();
        return this.router.navigateByUrl('/#/notFound');
      }

      this.dataService = res.data;
      Swal.hideLoading();
    });
  }

}
