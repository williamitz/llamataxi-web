import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { google } from '@agm/core/services/google-maps-types';
import { IDrivers, IMarkerDriver, IResCurrent } from '../../../interfaces/monitor.interface';
import { MonitorService } from '../../../services/monitor.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-monitor-drivers',
  templateUrl: './monitor-drivers.component.html',
  styleUrls: ['./monitor-drivers.component.css']
})
export class MonitorDriversComponent implements OnInit, OnDestroy {
  @ViewChild('mapMonitor', {static: true}) mapMonitor: ElementRef;
  loadSbc: Subscription;
  ioCoordsSbc: Subscription;
  ioLogoutSbc: Subscription;
  map: google.maps.Map;

  codJournal = 'DIURN';

  dataDrivers: IDrivers[] = [];
  markers: IMarkerDriver[] = [];


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
    this.onLoadDrivers();
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
            map: this.map
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
        findeed.marker.setPosition( new google.maps.LatLng( res.coords.lat, res.coords.lng ) );
      } else {

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng( res.coords.lat, res.coords.lng ),
          animation: google.maps.Animation.DROP,
          map: this.map
        });

        this.markers.push({ pkUser: res.pkUser, occupied: res.occupied, marker });
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


  }

}
