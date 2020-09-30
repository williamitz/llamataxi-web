import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { google } from '@agm/core/services/google-maps-types';
import { IDrivers, IMarkerDriver, IResCurrent, IZoneDemand, IPolygons, IServiceSocket, IDisposal, IMarkerClient, IClient } from '../../../interfaces/monitor.interface';
import { MonitorService } from '../../../services/monitor.service';
import { pipe, Subscription } from 'rxjs';
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
  @ViewChild('infoClient', {static: true}) infoClient: ElementRef;

  loadDriversSbc: Subscription;
  loadClientSbc: Subscription;
  ioCoordsSbc: Subscription;
  ioCoordsClientSbc: Subscription;
  ioLogoutSbc: Subscription;
  ioPlayGeoSbc: Subscription;
  ioNewServiceSbc: Subscription;
  ioCancelServiceSbc: Subscription;
  zonesSbc: Subscription;
  map: google.maps.Map;

  codJournal = 'DIURN';

  dataDrivers: IDrivers[] = [];
  dataClients: IClient[] = [];
  markers: IMarkerDriver[] = [];
  markersClient: IMarkerClient[] = [];
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

  currentClient: IClient = {
    pkUser: 0,
    nameComplete: '',
    lat: 0,
    lng: 0,
    codeCategory: ''
  };

  infoWindowPolygon: google.maps.InfoWindow;
  infoWindowDriver: google.maps.InfoWindow;
  infoWindowClient: google.maps.InfoWindow;
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
    this.infoWindowClient = new google.maps.InfoWindow();

    this.onLoadDrivers();
    this.onLoadClients();
    this.onGetZonesDemand();

    this.onListenNewService();
    this.onListenCancelService();

    this.onListenCoordsDriver();
    this.onListenCoordsClient();
    this.onListenLogout();
    this.onListenPlayGeo();
  }

  onLoadDrivers() {
    this.loadDriversSbc = this.monitor.onGetDrivers()
    .pipe( retry() )
    .subscribe( (res) => {

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

  onLoadClients() {

    this.loadClientSbc = this.monitor.onGetClients()
    .pipe( retry() )
    .subscribe( (res) => {

      if (!res.ok) {
        throw new Error(res.error);
      }

      this.dataClients = res.data;

      if (this.dataClients.length > 0) {

        this.dataClients.forEach( driver => {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng( driver.lat, driver.lng ),
            animation: google.maps.Animation.DROP,
            map: this.map,
            icon: './assets/img/icons/mark_client.png'
          });

          marker.addListener('click', (data: any) => {
            this.infoWindowClient.setContent(this.infoClient.nativeElement);
            this.infoWindowClient.setPosition( marker.getPosition() );

            this.currentClient.nameComplete = driver.nameComplete;
            this.currentClient.codeCategory = driver.codeCategory;

            this.infoWindowClient.open(this.map);
          });
          this.markersClient.push({ pkUser: driver.pkUser, marker });

        });

      }

    });

  }

  onListenCoordsDriver() {
    this.ioCoordsSbc = this.io.onListen('current-position-driver')
    .pipe( retry() )
    .subscribe( (res: IResCurrent) => {
      const findeed = this.markers.find( mk => mk.pkUser === res.pkUser );
      // console.log('moviendo marker', res);
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

  onListenCoordsClient() {

    this.ioCoordsClientSbc = this.io.onListen('current-position-client')
    .pipe( retry() )
    .subscribe( (resIO: IResCurrent) => {

      const findeed = this.markersClient.find( mk => mk.pkUser === resIO.pkUser );
      // console.log('moviendo marker', res);
      if (findeed) {
        findeed.codeCategory = resIO.codeCategory;
        findeed.marker.setPosition( new google.maps.LatLng( resIO.coords.lat, resIO.coords.lng ) );

        findeed.marker.addListener('click', () => {
          this.infoWindowClient.setContent(this.infoClient.nativeElement);
          this.infoWindowClient.setPosition( findeed.marker.getPosition() );

          this.currentClient.nameComplete = resIO.nameComplete;
          this.currentClient.codeCategory = resIO.codeCategory;

          this.infoWindowClient.open(this.map);
        });

      } else {

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng( resIO.coords.lat, resIO.coords.lng ),
          animation: google.maps.Animation.DROP,
          map: this.map,
          icon: './assets/img/icons/mark_client.png',
        });

        marker.addListener('click', (data: any) => {
          this.infoWindowDriver.setContent(this.infoClient.nativeElement);
          this.infoWindowDriver.setPosition( marker.getPosition() );

          this.currentDriver.nameComplete = resIO.nameComplete;
          this.currentDriver.codeCategory = resIO.codeCategory;

          this.infoWindowDriver.open(this.map);
        });

        this.markersClient.push({ pkUser: resIO.pkUser, marker, codeCategory: resIO.codeCategory });
      }

    });

  }

  onGetZonesDemand() {
    this.zonesSbc = this.monitor.onGetZonesDemand().pipe( retry() ).subscribe( (res) => {
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
    this.ioNewServiceSbc = this.io.onListen('new-service')
    .pipe( retry() )
    .subscribe( (resIO: IServiceSocket) => {
      // recibimos la data del nuevo servicio
      const indexHex = resIO.indexHex;

      const polygonFinded = this.polygons.find( polygon => polygon.indexHex === indexHex );

      if (!polygonFinded) {

        this.onBuildPolygon( indexHex, resIO.center, resIO.polygon, 1, resIO.totalDrivers );

      } else {

        polygonFinded.totalServices += 1;
        polygonFinded.totalDrivers = resIO.totalDrivers;
        polygonFinded.polygon.setMap(this.map);

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

    const polygon = new google.maps.Polygon({
      paths: verticesCoords,
      strokeColor: color,
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: this.map
    });

    // Add a listener for the click event.
    polygon.addListener('click', (data: any) => {
      this.infoWindowPolygon.setContent(this.infoPolygon.nativeElement);
      this.infoWindowPolygon.setPosition( positionPolygon );

      // const tServices = this.polygons.find( pp => pp.indexHex === indexHex ).totalServices || 0;
      // const tDrivers = this.polygons.find( pp => pp.indexHex === indexHex ).totalDrivers || 0;

      this.totalServicesZone = totalServices;
      this.totalDriverZone = totalDrivers;

      this.infoWindowPolygon.open(this.map);
    });

    this.polygons.push( { indexHex,
                            totalServices,
                            totalDrivers,
                            polygon,
                            color} );

    if (this.indexColor <= 5) {
      this.indexColor++;
    }

  }

  onListenCancelService() {
    this.ioCancelServiceSbc = this.io.onListen('disposal-service')
    .pipe( retry() )
    .subscribe( (resIO: IDisposal) => {

      const polygonFinded = this.polygons.find( polygon => polygon.indexHex === resIO.indexHex );
      const clientFinded = this.markersClient.find( mkCli => mkCli.pkUser === resIO.pkClient );

      if (clientFinded) {
        clientFinded.marker.setMap( null );
      }

      if (polygonFinded && polygonFinded.totalServices > 0) {

        polygonFinded.totalServices -= 1;

        if (polygonFinded.totalServices === 0) {
          polygonFinded.polygon.setMap(null);
        }

      }

    });
  }

  onListenLogout() {

    this.ioLogoutSbc = this.io.onListen('user-disconnect')
    .pipe( retry() )
    .subscribe( (res: IResCurrent) => {
      const findeed = this.markers.find( mk => mk.pkUser === res.pkUser );
      // console.log('moviendo marker', res);
      if (findeed) {
        findeed.marker.setMap( null );
        this.markers = this.markers.filter( mk => mk.pkUser !== res.pkUser );
      }
    });

  }

  onListenPlayGeo() {

    this.ioPlayGeoSbc = this.io.onListen('driver-off')
    .pipe( retry() )
    .subscribe( (res: any) => {
      const findeed = this.markers.find( mk => mk.pkUser === Number( res.pkUser ) );
      if (findeed) {
        findeed.marker.setMap( null );
        this.markers = this.markers.filter( mk => mk.pkUser !== Number( res.pkUser ) );
      }
    });

  }

  ngOnDestroy() {

    this.loadDriversSbc.unsubscribe();
    this.loadClientSbc.unsubscribe();
    this.ioCoordsSbc.unsubscribe();
    this.ioCoordsClientSbc.unsubscribe();
    this.ioLogoutSbc.unsubscribe();
    this.ioPlayGeoSbc.unsubscribe();

    this.zonesSbc.unsubscribe();
    this.ioNewServiceSbc.unsubscribe();
    this.ioCancelServiceSbc.unsubscribe();

  }

}
