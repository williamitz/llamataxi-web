import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { google } from '@agm/core/services/google-maps-types';
import { IDrivers, IMarkerDriver, IResCurrent, IZoneDemand, IPolygons, IServiceSocket } from '../../../interfaces/monitor.interface';
import { MonitorService } from '../../../services/monitor.service';
import { Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-monitor-drivers',
  templateUrl: './monitor-drivers.component.html',
  styleUrls: ['./monitor-drivers.component.css']
})
export class MonitorDriversComponent implements OnInit, OnDestroy {
  @ViewChild('mapMonitor', {static: true}) mapMonitor: ElementRef;
  @ViewChild('infoPolygon', {static: true}) infoPolygon: ElementRef;
  @ViewChild('infoDriver', {static: true}) infoDriver: ElementRef;
  
  loadSbc: Subscription;
  ioCoordsSbc: Subscription;
  ioLogoutSbc: Subscription;
  ioNewServiceSbc: Subscription;
  ioCancelServiceSbc: Subscription;
  zonesSbc: Subscription;
  map: google.maps.Map;

  codJournal = 'DIURN';

  dataDrivers: IDrivers[] = [];
  markers: IMarkerDriver[] = [];
  dataZones: IZoneDemand[] = [];
  polygons: IPolygons[] = [];

  currentDriver: IDrivers = {
    pkUser: 0,
    nameComplete: '',
    lat: 0,
    lng: 0,
    codeCategory: '',
    occupied: false
  };

  infoWindowPolygon: google.maps.InfoWindow;
  infoWindowDriver: google.maps.InfoWindow;
  demandColors = ['#0091F2', '#209FF4', '#40ADF5', '#60BAF7', '#80C8F8', '#9FD6FA'];
  indexColor = 0;
  totalServicesZone = 0;
  totalDriverZone = 0;

  constructor( private monitor: MonitorService, private io: SocketService ) { }

  ngOnInit(): void {
    this.onLoadMap();
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

    this.infoWindowPolygon = new google.maps.InfoWindow();
    this.infoWindowDriver = new google.maps.InfoWindow();
    
    this.onLoadDrivers();
    this.onGetZonesDemand();

    this.onListenNewService();
    this.onListenCancelService();

    this.onListenCurrentCoords();
    this.onListenLogout();
  }

  onLoadDrivers() {
    this.loadSbc = this.monitor.onGetDrivers().subscribe( (res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.dataDrivers = res.data;

      if (this.dataDrivers.length > 0) {

        this.dataDrivers.forEach( driver => {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng( driver.lat, driver.lng ),
            animation: google.maps.Animation.DROP,
            map: this.map,
            icon:  driver.occupied ? './assets/img/point-yellow.png' : './assets/img/point-green.png'
          });

          marker.addListener('click', (data: any) => {
            this.infoWindowDriver.setContent(this.infoDriver.nativeElement);
            this.infoWindowDriver.setPosition( marker.getPosition() );

            this.currentDriver.nameComplete = driver.nameComplete;
            this.currentDriver.codeCategory = driver.codeCategory;
            this.currentDriver.occupied = driver.occupied;

            this.infoWindowDriver.open(this.map);
          });
          this.markers.push({ pkUser: driver.pkUser, occupied: driver.occupied, marker });


        });

      }

    });
  }

  onListenCurrentCoords() {
    this.ioCoordsSbc = this.io.onListen('current-position-driver').subscribe( (res: IResCurrent) => {
      const findeed = this.markers.find( mk => mk.pkUser === res.pkUser );
      console.log('moviendo marker', res);
      if (findeed) {
        findeed.codeCategory = res.codeCategory;
        findeed.marker.setPosition( new google.maps.LatLng( res.coords.lat, res.coords.lng ) );
        findeed.marker.setIcon( res.occupied ? './assets/img/point-yellow.png' : './assets/img/point-green.png' );

        findeed.marker.addListener('click', (data: any) => {
          this.infoWindowDriver.setContent(this.infoDriver.nativeElement);
          this.infoWindowDriver.setPosition( findeed.marker.getPosition() );

          this.currentDriver.nameComplete = res.nameComplete;
          this.currentDriver.codeCategory = res.codeCategory;
          this.currentDriver.occupied = res.occupied;

          this.infoWindowDriver.open(this.map);
        });

      } else {

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng( res.coords.lat, res.coords.lng ),
          animation: google.maps.Animation.DROP,
          map: this.map,
          icon: res.occupied ? './assets/img/point-yellow.png' : './assets/img/point-green.png'
        });

        marker.addListener('click', (data: any) => {
          this.infoWindowDriver.setContent(this.infoDriver.nativeElement);
          this.infoWindowDriver.setPosition( marker.getPosition() );

          this.currentDriver.nameComplete = res.nameComplete;
          this.currentDriver.codeCategory = res.codeCategory;
          this.currentDriver.occupied = res.occupied;

          this.infoWindowDriver.open(this.map);
        });

        this.markers.push({ pkUser: res.pkUser, occupied: res.occupied, marker, codeCategory: res.codeCategory });
      }
    });
  }

  onGetZonesDemand() {
    this.zonesSbc = this.monitor.onGetZonesDemand().pipe( retry(3) ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataZones = res.data;
      this.indexColor = 0;
      this.dataZones.forEach( dp => {
        this.onBuildPolygon( dp.indexHex, dp.center, dp.polygon, dp.total, dp.totalDrivers );
      });

    });
  }

  onListenNewService() {
    this.ioNewServiceSbc = this.io.onListen('new-service').subscribe( (resSocket: IServiceSocket) => {
      // recibimos la data del nuevo servicio
      const indexHex = resSocket.indexHex;

      // if ( indexHex === this.st.indexHex) {
      //   this.dataZones.unshift( resSocket.data );
      // }

      const polygonFinded = this.polygons.find( polygon => polygon.indexHex === indexHex );

      if (!polygonFinded) {

        this.onBuildPolygon( resSocket.indexHex, resSocket.center, resSocket.polygon, 1, resSocket.totalDrivers );

      } else {

        polygonFinded.totalServices += 1;
        polygonFinded.totalDrivers = resSocket.totalDrivers;

        if (!polygonFinded.polygon.getMap()) {
          polygonFinded.polygon.setMap(this.map);
        }

      }

    });
  }

  onBuildPolygon(indexHex: string, center: number[], vertices: number[][], totalServices = 0, totalDrivers = 0) {

    const positionPolygon = new google.maps.LatLng( center[0], center[1] );
    const verticesCoords: google.maps.LatLng[] = [];
    const color = this.demandColors[this.indexColor];
    vertices.forEach( (coords) => {
      verticesCoords.push( new google.maps.LatLng( coords[0], coords[1] ) );
    });

    const hotPolygon = new google.maps.Polygon({
      paths: verticesCoords,
      strokeColor: color,
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: this.map
    });


    // Add a listener for the click event.
    hotPolygon.addListener('click', (data: any) => {
      this.infoWindowPolygon.setContent(this.infoPolygon.nativeElement);
      this.infoWindowPolygon.setPosition( positionPolygon );

      const tServices = this.polygons.find( pp => pp.indexHex === indexHex ).totalServices || 0;
      const tDrivers = this.polygons.find( pp => pp.indexHex === indexHex ).totalDrivers || 0;

      this.totalServicesZone = totalServices;
      this.totalDriverZone = totalDrivers;

      this.infoWindowPolygon.open(this.map);
    });
    this.polygons.push( { indexHex,
                            totalServices,
                            totalDrivers,
                            polygon: hotPolygon,
                            color} );

    if (this.indexColor <= 5) {
      this.indexColor++;
    }

  }

  onListenCancelService() {
    this.ioCancelServiceSbc = this.io.onListen('disposal-service').subscribe( (res: any) => {

      const polygonFinded = this.polygons.find( polygon => polygon.indexHex === res.indexHex );

      if (polygonFinded && polygonFinded.totalServices > 0) {

        polygonFinded.totalServices -= 1;

        if (polygonFinded.totalServices === 0) {
          polygonFinded.polygon.setMap(null);
        }

      }

    });
  }

  onListenLogout() {

    this.ioLogoutSbc = this.io.onListen('user-disconnect').subscribe( (res: IResCurrent) => {
      const findeed = this.markers.find( mk => mk.pkUser === res.pkUser );
      // console.log('moviendo marker', res);
      if (findeed) {
        findeed.marker.setMap( null );
        this.markers = this.markers.filter( mk => mk.pkUser !== res.pkUser );
      }
    });

  }

  ngOnDestroy() {

    this.loadSbc.unsubscribe();

    this.ioCoordsSbc.unsubscribe();
    this.ioLogoutSbc.unsubscribe();

    this.zonesSbc.unsubscribe();
    this.ioNewServiceSbc.unsubscribe();
    this.ioCancelServiceSbc.unsubscribe();

  }

}
