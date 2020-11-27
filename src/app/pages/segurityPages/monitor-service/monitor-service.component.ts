import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';
import { IServiceMonitor } from 'src/app/interfaces/monitor.interface';
import { ICoorsIO, IResponse } from 'src/app/interfaces/response.interface';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MonitorService } from '../../../services/monitor.service';
import swal from 'sweetalert2';

const URI_API = environment.URL_SERVER;

@Component({
  selector: 'app-monitor-service',
  templateUrl: './monitor-service.component.html',
  styleUrls: ['./monitor-service.component.css']
})
export class MonitorServiceComponent implements OnInit, OnDestroy {

  @ViewChild( 'mapMonitor', {static: true} ) mapMonitor: ElementRef;

  sbcInfo: Subscription;
  ioSbc: Subscription;
  dataService: IServiceMonitor = {
    abduzcan: 0,
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
  marker: google.maps.Marker;
  pathImg = URI_API + `/User/Img/Get/`;
  polygonsRing = [
    {
      polygon: [
        [ -12.153928957674205, -77.02947735531805 ],
        [ -12.165216140114222, -77.03761444195483 ],
        [ -12.17774713305863, -77.0317763037954 ],
        [ -12.178990208504153, -77.01780092274812 ],
        [ -12.167702879401507, -77.00966483009137 ],
        [ -12.155172621555119, -77.01550312406258 ]
      ],
      center: [ -12.166459896881399, -77.02363929665978 ]
    },
    {
      polygon: [
        [ -12.140152275097668, -77.0492897715627 ],
        [ -12.151439309465447, -77.05742785022237 ],
        [ -12.163971609194965, -77.05159026436306 ],
        [ -12.165216140114222, -77.03761444195483 ],
        [ -12.153928957674205, -77.02947735531805 ],
        [ -12.14139739242638, -77.03531509862725 ]
      ],
      center: [ -12.152684520279188, -77.04345226457582 ]
    },
    {
      polygon: [
        [ -12.163971609194965, -77.05159026436306 ],
        [ -12.175258657607207, -77.05972909778875 ],
        [ -12.187790383948943, -77.05389111729414 ],
        [ -12.189034328520433, -77.03991414526953 ],
        [ -12.17774713305863, -77.0317763037954 ],
        [ -12.165216140114222, -77.03761444195483]
      ],
      center: [ -12.176503282727966, -77.04575236268025 ]
    },
    {
      polygon: [
        [ -12.17774713305863, -77.0317763037954 ],
        [ -12.189034328520433, -77.03991414526953 ],
        [ -12.20156474502873, -77.03407561222654 ],
        [ -12.202807232101039, -77.0200990812437 ],
        [ -12.19151989099901, -77.0119622336788 ],
        [ -12.178990208504153, -77.01780092274812 ]
      ],
      center: [ -12.190277497568687, -77.02593785019312 ]
    },
    {
      polygon: [
        [ -12.167702879401507, -77.00966483009137 ],
        [ -12.178990208504153, -77.01780092274812 ],
        [ -12.19151989099901, -77.0119622336788 ],
        [ -12.192761508717131, -76.99798729734013 ],
        [ -12.181474034361642, -76.98985220061996 ],
        [ -12.168945087579953, -76.9956910438627 ]
      ],
      center: [ -12.180232508969892, -77.00382622115197 ]
    },
    {
      polygon: [
        [ -12.143885308646022, -77.0073677862035 ],
        [ -12.155172621555119, -77.01550312406258 ],
        [ -12.167702879401507, -77.00966483009137 ],
        [ -12.168945087579953, -76.9956910438627 ],
        [ -12.157657628395317, -76.98755670201037 ],
        [ -12.145128107346746, -76.99339514994088 ]
      ],
      center: [ -12.156415511826998, -77.00152957242248 ]
    },
    {
      polygon: [
        [ -12.130110227202895, -77.0271787667174 ],
        [ -12.14139739242638, -77.03531509862725 ],
        [ -12.153928957674205, -77.02947735531805 ],
        [ -12.155172621555119, -77.01550312406258 ],
        [ -12.143885308646022, -77.0073677862035 ],
        [ -12.131354479580667, -77.01320568510995 ]
      ],
      center: [ -12.142641736974271, -77.02134110296983 ]
    }
  ];

  directionService: google.maps.DirectionsService;
  directionRender: google.maps.DirectionsRenderer;

  // tslint:disable-next-line: max-line-length
  constructor( private routerAct: ActivatedRoute, private router: Router, private monitorSvc: MonitorService, private io: SocketService ) { }

  ngOnInit(): void {
    this.tokenMonitor = String( this.routerAct.snapshot.params.tokenMonitor ) || 'xD';
    this.onLoadMap();
    this.onLoadInfo();
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
    this.marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      map: this.map,
      icon: './assets/img/point-yellow.png'
    });

    this.directionService = new google.maps.DirectionsService();
    this.directionRender = new google.maps.DirectionsRenderer({map: this.map});

  }

  onLoadInfo() {
    swal.fire({text: 'Espere...'});
    swal.showLoading();
    // Swal.showLoading();

    this.sbcInfo = this.monitorSvc.onGetInfoService( this.tokenMonitor )
    .pipe( retry(3) )
    .subscribe( (res) => {
      if (!res.ok) {
        Swal.close();
        return this.router.navigateByUrl('/notFound');
      }

      this.dataService = res.data;
      // this.io.onEmit()
      this.onLoadRoute();
      this.onSingMonitor();
      
      Swal.close();
    });
  }

  onListenCoors() {
    this.ioSbc = this.io.onListen('current-position-driver')
    .pipe( )
    .subscribe( (res: ICoorsIO) => {
      console.log('nuevo socket', res);
      this.marker.setPosition( new google.maps.LatLng( res.lat, res.lng ) );
    });
  }

  onLoadRoute() {
    const pointA = new google.maps.LatLng( this.dataService.latOrigin, this.dataService.lngOrigin );
    const lat = this.dataService.latDestination;
    const lng = this.dataService.lngDestination;

    const pointB = new google.maps.LatLng( lat, lng );

    this.directionService.route({ origin: pointA,
                                  destination: pointB,
                                  travelMode: google.maps.TravelMode.DRIVING }, (res, status) => {
        if (status === 'OK') {
          this.directionRender.setDirections(res);
        }
    });
  }

  onSingMonitor() {
    const payload = {
      pkService: this.dataService.abduzcan,
      role: 'MONITOR'
    };
    this.io.onEmit('sing-monitor', payload, (resIO: IResponse) => {
      if (resIO.ok) {
        console.log('Socket monitor configurado', resIO);
        this.onListenCoors();
      }
    });

  }

  ngOnDestroy() {
    if (this.sbcInfo) {
      this.sbcInfo.unsubscribe();
    }

    if (this.ioSbc) {
      this.ioSbc.unsubscribe();
    }
  }

}
