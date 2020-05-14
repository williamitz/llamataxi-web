import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-TaxiMap",
  templateUrl: "./taxiMap.component.html",
  styleUrls: ["./taxiMap.component.css"],
})
export class TaxiMapComponent implements OnInit {
  texto: string = "Wenceslau Braz - Cuidado com as cargas";
  /* lat: number = -12.0740486;
  lng: number = -77.0477913; */
  //zoom: number = 15;
  filtroNombre = "";
  filtroDocumento = "";
  constructor() {}
  ngOnInit() {}

  zoom: number = 8;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }

  markers: marker[] = [
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
    {
      lat: 51.723301,
      lng: 7.895301,
      label: "d",
      draggable: true,
    },
  ];
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
