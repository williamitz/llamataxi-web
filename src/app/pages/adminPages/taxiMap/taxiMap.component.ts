import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-taximap',
  templateUrl: './taxiMap.component.html',
  styleUrls: ['./taxiMap.component.css'],
})
export class TaxiMapComponent implements OnInit {
  texto = 'Wenceslau Braz - Cuidado com as cargas';
  markers: Imarker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: "A",
      draggable: true,
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: "B",
      draggable: false,
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: "C",
      draggable: true,
    },
  ];

  filtroNombre = "";
  filtroDocumento = "";
  zoom = 8;

  // initial center position for the map
  lat = 51.673858;
  lng = 7.815982;

  constructor() {}
  ngOnInit() {}


  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
    });
  }

  markerDragEnd(m: Imarker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

}

interface Imarker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
