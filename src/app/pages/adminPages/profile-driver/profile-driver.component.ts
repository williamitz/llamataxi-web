import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';
import Swal from 'sweetalert2';
import Swiper from 'swiper';
import { IVehicle } from '../../../interfaces/vehicle.interface';
import { IProfileDriver } from 'src/app/interfaces/driver-profile.interface';

const URI_API = environment.URL_SERVER;
declare var pdfjsLib: any;
@Component({
  selector: 'app-profile-driver',
  templateUrl: './profile-driver.component.html',
  styleUrls: ['./profile-driver.component.css']
})
export class ProfileDriverComponent implements OnInit {
  // :entity/:idEntity/:fileName
  @ViewChild('canvasCriminal', {static: false}) canvasCriminal: ElementRef;
  @ViewChild('canvasPolicial', {static: false}) canvasPolicial: ElementRef;

  pathDriver = URI_API + `/Driver/Img/Get/`;
  pathImg = URI_API + `/User/Img/Get/`;
  token = '';

  criminalIsPdf = false;
  policialIsPdf = false;

  dataProfile: IProfileDriver = {
    img: ''
  };

  vehicles: IVehicle[];
  index = 0;
  configSlider = {
    initialSlide: 0,
    slidesPerView: 1.2,
    spaceBetween: 30,
    // loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };



  constructor(private router: ActivatedRoute, private driverSvc: DriverService, private storage: StorageService) { }

  ngOnInit() {
    this.storage.onLoadToken();
    this.token = `?token=${ this.storage.token }`;
    console.log(this.router.snapshot.params.id);
    this.onGetProfile( this.router.snapshot.params.id || 0 );
    // console.log(this.router.snapshot.data);
  }

  onGetProfile( id: number ) {
    this.driverSvc.onGetProfile( id ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data[0].profile;
      this.vehicles = res.data[0].vehicles;

      console.log(res);

      if (!this.dataProfile.isEmployee) {

        const arrCriminal: string[] = this.dataProfile.imgCriminalRecord.split('.');
        const extCriminal = arrCriminal[ arrCriminal.length - 1 ];

        const arrPolicial: string[] = this.dataProfile.imgPolicialRecord.split('.');
        const extPolicial = arrCriminal[ arrPolicial.length - 1 ];

        if (extCriminal.toUpperCase() === 'PDF') {
          this.criminalIsPdf = true;

          // tslint:disable-next-line: max-line-length
          pdfjsLib.getDocument( this.pathDriver + 'driver/' + this.dataProfile.pkDriver + '/' + this.dataProfile.imgCriminalRecord + this.token ).then( (doc: any) => {
              console.log(doc);
              doc.getPage(1).then( (page: any) => {

                const canvas = this.canvasCriminal.nativeElement;
                const context = canvas.getContext('2d');

                const viewport = page.getViewport(1);
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({
                  canvasContext: context,
                  viewport
                });
              });

          }).catch( e => {
            Swal.fire({
              icon: 'error',
              text: 'Comuniquse con el administrador',
              title: 'Error al visualizar archivo pdf',
              confirmButtonText: 'Ok'
            });
          });

        }

        if (extPolicial.toUpperCase() === 'PDF') {
          this.policialIsPdf = true;

          // tslint:disable-next-line: max-line-length
          pdfjsLib.getDocument( this.pathDriver + 'driver/' + this.dataProfile.pkDriver + '/' + this.dataProfile.imgPolicialRecord + this.token ).then( (doc: any) => {
              console.log(doc);
              doc.getPage(1).then( (page: any) => {

                const canvas = this.canvasPolicial.nativeElement;
                const context = canvas.getContext('2d');

                const viewport = page.getViewport(1);
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({
                  canvasContext: context,
                  viewport
                });
              });

          }).catch( e => {
            Swal.fire({
              icon: 'error',
              text: 'Comuniquse con el administrador',
              title: 'Error al visualizar archivo pdf',
              confirmButtonText: 'Ok'
            });
          });

        }

        //policialIsPdf

      }
    });
  }


  onShowPreview() {
    $('#btnShowPreview').trigger('click');
  }

}
