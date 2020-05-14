import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';
import Swal from 'sweetalert2';
import { IVehicle } from '../../../interfaces/vehicle.interface';
import { IProfileDriver } from 'src/app/interfaces/driver-profile.interface';
import { MessageModel } from '../../../models/message.model';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import * as $ from 'jquery';
import { IMsg } from '../../../interfaces/message.interface';

const URI_API = environment.URL_SERVER;
declare var pdfjsLib: any;
@Component({
  selector: 'app-profile-driver',
  templateUrl: './profile-driver.component.html',
  styleUrls: ['./profile-driver.component.css']
})
export class ProfileDriverComponent implements OnInit {
  // :entity/:idEntity/:fileName
  @ViewChild('canvasCriminal') canvasCriminal: ElementRef;
  @ViewChild('canvasPolicial') canvasPolicial: ElementRef;

  pkDriver = 0;

  pathDriver = URI_API + `/Driver/Img/Get/`;
  pathImg = URI_API + `/User/Img/Get/`;
  token = '';

  bodyMessage: MessageModel;
  bodyResponse: MessageModel;
  criminalIsPdf = false;
  policialIsPdf = false;

  dataProfile: IProfileDriver = {
    img: ''
  };

  loading = false;

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

  dataMsg: IMsg[] = [];
  dataMsgRes: IMsg[] = [];
  dataViewMsg: IMsg = {
    pkMessage: 0
  };
  newResponse = false;
  loadingResponse = false;
  // tslint:disable-next-line: max-line-length
  constructor(private router: ActivatedRoute, private driverSvc: DriverService, private storage: StorageService, private msgSvc: MessageService) { }

  ngOnInit() {
    this.storage.onLoadToken();
    this.token = `?token=${ this.storage.token }`;
    console.log(this.router.snapshot.params.id);
    this.pkDriver = Number( this.router.snapshot.params.id ) || 0;
    this.onGetProfile( this.pkDriver );
    this.bodyMessage = new MessageModel(true);
    this.bodyResponse = new MessageModel( true );
    this.onGetMessages();
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

  onGetMessages() {
    this.msgSvc.onGetMessages( this.pkDriver, 1, 10, true ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMsg = res.data;
      console.log(res);
    });
  }

  onShowPreview() {
    $('#btnShowPreview').trigger('click');
  }

  onSendMessage(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      this.bodyMessage.fkUserReceptor = this.dataProfile.pkUser;
      console.log(this.bodyMessage);
      this.msgSvc.onAddMessage( this.bodyMessage ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loading = false;
        if (res.showError !== 0) {
          Swal.fire({
            title: 'Mensaje al usuario',
            icon: 'error',
            text: this.onGetErrorMsg( res.showError )
          });

          return;
        }
        $('#btnCloseModalMg').trigger('click');
        Swal.fire({
          title: 'Mensaje al usuario',
          icon: 'success',
          text: 'Mensaje enviado exitosamente'
        });
        this.onGetMessages();
      });
    }
  }

  onGetErrorMsg( showError: number ) {
    let arrError = showError === 0 ? ['Mensaje enviado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del emisor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('emisor inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('no se encontró registro del receptor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('receptor inactivo');
    }

    return arrError.join(', ');
  }

  onShowViewMsg( pkMessage: number ) {
    console.log('mensaje', pkMessage);
    this.dataViewMsg = this.dataMsg.find( msg => msg.pkMessage === pkMessage );
    this.bodyResponse.pkMessage = this.dataViewMsg.pkMessage;
    this.bodyResponse.fkUserReceptor = this.dataProfile.pkUser;
    this.msgSvc.onGetResponseMsg( pkMessage ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMsgRes = res.data;
      console.log(res);
    });
    $('#btnShowViewMsgModal').trigger('click');
  }

  onSubmitMsgRes(frmMsgRes: NgForm) {
    if (frmMsgRes.valid) {
      console.log(this.bodyResponse);
      this.loadingResponse = true;

      this.msgSvc.onAddMsgRes( this.bodyResponse ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loadingResponse = false;
        if (res.showError !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.onGetErrorMsgRes( res.showError )
          });
          return;
        }

        const finded = this.dataMsg.find( msg => msg.pkMessage === this.bodyResponse.pkMessage );
        finded.totalResponses += 1;
        const resRes: any = res.data;
        this.dataMsgRes.push({
            pkMessage: resRes.pkMessage,
            fkUserEmisor: 0,
            fkUserReceptor: 0,
            nameEmisor: resRes.nameEmisor,
            nameReceptor: resRes.nameReceptor,
            dateRegister: resRes.dateRegister,
            message: this.bodyResponse.message
        });

        Swal.fire({
          icon: 'success',
          title: 'Mensaje al usuario',
          text: 'Mensaje enviado con éxito'
        });
        this.newResponse = false;
        this.bodyResponse.message = '';
        console.log(res);
      });
    }
  }

  onGetErrorMsgRes( showError: number ) {
    const arrError = showError === 0 ? ['Mensaje enviado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del mensaje');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('no se encontró registro del mensaje');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('emisor inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('no se encontró registro del receptor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 16) {
      arrError.push('receptor inactivo');
    }

    return arrError.join(', ');
  }

}
