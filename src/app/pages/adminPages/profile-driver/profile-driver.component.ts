import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage.service';
import Swal from 'sweetalert2';
import {SweetAlertIcon} from 'sweetalert2';
import { IVehicle } from '../../../interfaces/vehicle.interface';
import { IProfileDriver } from 'src/app/interfaces/driver-profile.interface';
import { MessageModel } from '../../../models/message.model';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import * as $ from 'jquery';
import { IMsg } from '../../../interfaces/message.interface';
import { VehicleVerifModel } from '../../../models/vehicleVerif.model';
import { BrandService } from '../../../services/brand.service';
import { IBrand } from '../../../interfaces/brand.interface';
import { ICategory } from '../../../interfaces/category.interface';
import { IModel } from '../../../interfaces/model.interface';
import { DriverVerif } from '../../../models/driverVerif.model';
import { VehicleDriverModel } from '../../../models/vehicleDriver.model';
import * as moment from 'moment';
import { IColor } from '../../../interfaces/vehicleDriver.interface';
import { VehicleDriverService } from '../../../services/vehicleDriver.service';

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
  nowYear = moment().year();
  dataYears: number[] = [];
  dataColors: IColor[] = [{
    code: 'BLACK',
    text: 'NEGRO'
  }, {
    code: 'WHITE',
    text: 'BLANCO'
  }, {
    code: 'YELLOW',
    text: 'AMARILLO'
  }, {
    code: 'BROWN',
    text: 'MARRÓN'
  }, {
    code: 'BLUE',
    text: 'AZUL'
  }, {
    code: 'RED',
    text: 'ROJO'
  }, {
    code: 'GREEN',
    text: 'VERDE'
  }];

  pathDriver = URI_API + `/Driver/Img/Get/`;
  pathImg = URI_API + `/User/Img/Get/`;
  token = '';
  bodyDriverVerif: DriverVerif;
  bodyMessage: MessageModel;
  bodyResponse: MessageModel;
  bodyVehicleVerif: VehicleVerifModel;
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

  dataUser: any;
  dataMsg: IMsg[] = [];
  dataMsgRes: IMsg[] = [];
  dataViewMsg: IMsg = {
    pkMessage: 0
  };
  dataCategory: ICategory[] = [];
  dataBrand: IBrand[] = [];
  dataModel: IModel[] = [];
  newResponse = false;
  loadingResponse = false;
  loadingVehicle = false;
  loadingDriver = false;

  replaceFile: File;
  bodyVehicle: VehicleDriverModel;
  filesValid = ['PNG', 'JPG', 'JPEG', 'PDF'];
  imgValid = ['PNG', 'JPG', 'JPEG'];
  titleModalVehicle = 'Nuevo vehículo';
  textBtnModalVehicle = 'Guardar';
  loadDataVehicle = false;
  /**
   * 'LICENSE'
   * ,'PHOTO_CHECK'
   * ,'CRIMINAL_RECORD'
   * ,'POLICIAL_RECORD'
   * ,'SOAT'
   * ,'PROPERTY_CARD'
   * ,'TAXI_FRONTAL'
   * ,'TAXI_BACK'
   * ,'TAXI_INTERIOR'
   */

  // tslint:disable-next-line: max-line-length
  constructor(private router: ActivatedRoute, private driverSvc: DriverService, private storage: StorageService, private msgSvc: MessageService, private brandSvc: BrandService, private vehicleSvc: VehicleDriverService) { }

  ngOnInit() {
    // $('.toot').trigger('tooltip');
    this.storage.onLoadToken();
    this.token = `?token=${ this.storage.token }`;
    this.dataUser = this.storage.onGetItem('dataUser', true);
    this.pkDriver = Number( this.router.snapshot.params.id ) || 0;
    this.bodyVehicle = new VehicleDriverModel( this.pkDriver );
    this.onGetProfile( this.pkDriver );
    this.bodyMessage = new MessageModel(true);
    this.bodyResponse = new MessageModel( true );
    this.bodyVehicleVerif = new VehicleVerifModel();
    this.bodyDriverVerif = new DriverVerif();
    this.onGetMessages();
    this.onGetCategory();
    this.onLoadYears();
    // console.log(this.router.snapshot.data);
  }

  onLoadYears() {
    for (let index = this.nowYear - 15 ; index <= this.nowYear; index++) {
      this.dataYears.push( index );
    }
  }

  onGetProfile( id: number ) {
    this.driverSvc.onGetProfile( id ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data.profile;
      this.vehicles = res.data.vehicles;
      this.bodyVehicle.fkPerson = this.dataProfile.pkPerson || 0;
      this.onShowPreviewPdf();
    });
  }

  onGetCategory() {
    this.brandSvc.onGetListAllCategory().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataCategory = res.data;
      console.log(res);
    });
  }

  onGetBrand( fkCategory: number ) {
    this.brandSvc.onGetBrandAll( fkCategory ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataBrand = res.data;
      console.log(res);
    });
  }

  onGetModel( fkCategory: number , fkBrand: number) {
    this.brandSvc.onGetModelAll( fkCategory, fkBrand ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataModel = res.data;
      console.log(res);
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

  onShowPreviewPdf() {
    this.criminalIsPdf = false;
    this.policialIsPdf = false;
    if (!this.dataProfile.isEmployee) {

      const arrCriminal: string[] = this.dataProfile.imgCriminalRecord.split('.');
      const extCriminal = arrCriminal[ arrCriminal.length - 1 ];

      const arrPolicial: string[] = this.dataProfile.imgPolicialRecord.split('.');
      const extPolicial = arrPolicial[ arrPolicial.length - 1 ];
      console.log(arrPolicial);
      console.log(this.dataProfile.imgPolicialRecord);
      if (extCriminal.toUpperCase() === 'PDF') {
        this.criminalIsPdf = true;

        // tslint:disable-next-line: max-line-length
        pdfjsLib.getDocument( this.pathDriver + 'driver/' + this.dataProfile.pkDriver + '/' + this.dataProfile.imgCriminalRecord + this.token ).then( (doc: any) => {

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
          this.onShowAlert('error', 'Comuniquse con el administrador', 'Error al visualizar archivo pdf');
        });

      }
      console.log(extPolicial.toUpperCase());

      if (extPolicial.toUpperCase() === 'PDF') {
        this.policialIsPdf = true;

        // tslint:disable-next-line: max-line-length
        pdfjsLib.getDocument( this.pathDriver + 'driver/' + this.dataProfile.pkDriver + '/' + this.dataProfile.imgPolicialRecord + this.token ).then( (doc: any) => {

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
          this.onShowAlert('error', 'Comuniquse con el administrador', 'Error al visualizar archivo pdf');
        });

      }

    }
  }

  onShowPreview() {
    $('#btnShowPreview').trigger('click');
  }

  onSendMessage(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      this.bodyMessage.fkUserReceptor = this.dataProfile.pkUser;

      this.msgSvc.onAddMessage( this.bodyMessage ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loading = false;
        if (res.showError !== 0) {
          this.onShowAlert('error', 'Mensaje al usuario', this.onGetErrorMsg( res.showError ), false);

          return;
        }
        $('#btnCloseModalMg').trigger('click');
        this.onShowAlert('success', 'Mensaje al usuario', 'Mensaje enviado exitosamente');

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

  onGetErrorVehicleVerif( showError: number ) {
    let arrError = showError === 0 ? ['Vehículo habilitado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del conductor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('conductor inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('no se encontró registro del vehículo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('vehículo inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 16) {
      arrError.push('vehículo inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 32) {
      arrError = ['Error', 'No se encontró registro de la categoría'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 64) {
      arrError = ['Error', 'No se encontró registro de la marca'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 128) {
      arrError = ['Error', 'No se encontró registro del modelo'];
    }

    return arrError.join(', ');
  }

  onGetErrorDriver( showError: number ) {
    const arrError = showError === 0 ? ['Conductor habilitado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del conductor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('conductor inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('conductor ya ha sido habilidado');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 8) {
      arrError.push('debe tener al menos un vehículo habilitado');
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
          this.onShowAlert('error', 'Error',  this.onGetErrorMsgRes( res.showError ));
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

        this.onShowAlert('success', 'Mensaje al usuario', 'Mensaje enviado con éxito', false);

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

  onShowAlert( icon: SweetAlertIcon, title: string, text = '', backdrop = true ) {
    Swal.fire({
      title,
      icon,
      text,
      backdrop
    });
  }

  onChangeFile( entity: string, document: string, file: FileList, pdf = false, idEntity = this.dataProfile.pkDriver) {

    this.replaceFile = file.item(0);
    const nombre = (file.item(0).name).toUpperCase();
    let msg = '';
    let verifyFile = true;
    let arrNombre = nombre.split('.');
    arrNombre = [ arrNombre[ arrNombre.length - 1 ] ];

    if (!pdf) {
      if ( !this.imgValid.includes( arrNombre[0] ) ) {
        msg = `Solo se aceptan archivos de tipo ${ this.imgValid.join(', ') }`;
        verifyFile = false;
      }
    } else {
      if ( !this.filesValid.includes( arrNombre[0] ) ) {
        msg = `Solo se aceptan archivos de tipo ${ this.filesValid.join(', ') }`;
        verifyFile = false;
      }
    }
    if ( (file.item(0).size / 1000000 ) > 1 ) {
      msg = 'Solo se aceptar archivos con un tamaño máximo de 1 mb';
      verifyFile = false;
    }

    if (!verifyFile) {

      this.onShowAlert('warning', 'Alerta', msg);
      return;
    }
    let findedVehicle: IVehicle = {
      imgSoat: '',
      imgPropertyCard: ''

    };
    if (entity === 'VEHICLE') {
      findedVehicle = this.vehicles.find( vh => vh.pkVehicle === idEntity );
    }

    this.onShowAlert(null, 'Subiendo...');

    Swal.showLoading();

    const reader = new FileReader();
    reader.onload = (event: any) => {
      // this.srcImage = event.target.result;
      this.driverSvc.onUploadDriver(
        entity,
        idEntity,
        document, this.dataProfile.pkDriver, this.replaceFile).subscribe( (res) => {
        if (!res.ok ) {
          throw new Error( res.error );
        }

        switch (document) {
          case 'LICENSE':
            this.dataProfile.imgLicense = res.newFile;
            break;
            case 'PHOTO_CHECK':
              this.dataProfile.imgPhotoCheck = res.newFile;
              break;
              case 'CRIMINAL_RECORD':
                this.dataProfile.imgCriminalRecord = res.newFile;
                this.onShowPreviewPdf();
                break;
                case 'POLICIAL_RECORD':
                  this.dataProfile.imgPolicialRecord = res.newFile;
                  this.onShowPreviewPdf();
                  break;
                  case 'SOAT':
                    findedVehicle.imgSoat = res.newFile;
                    break;
                    case 'PROPERTY_CARD':
                      findedVehicle.imgPropertyCard = res.newFile;
                      break;
                      case 'TAXI_FRONTAL':
                        this.dataProfile.imgPolicialRecord = res.newFile;

                        break;
          default:
            break;
        }

        this.replaceFile = null;
        Swal.close();
      });
    };
    reader.readAsDataURL(this.replaceFile);
  }

  onShowVehicleVerif( data: IVehicle ) {
    if (data.verified) {
      return;
    }

    this.bodyVehicleVerif.pkVehicle = data.pkVehicle;
    this.bodyVehicleVerif.pkDriver = this.pkDriver;
    this.bodyVehicleVerif.fkCategory = data.fkCategory;
    this.bodyVehicleVerif.fkBrand = data.fkBrand;
    this.bodyVehicleVerif.fkModel = data.fkModel;

    this.bodyVehicleVerif.numberPlate = data.numberPlate;
    this.bodyVehicleVerif.year = data.year;
    this.bodyVehicleVerif.imgFrontal = data.imgTaxiFrontal;
    this.bodyVehicleVerif.color = data.color;
    this.bodyVehicleVerif.observation = `Vehículo verificado por: ${ this.dataUser.nameComplete }.`;

    setTimeout(() => {
      this.onGetBrand( data.fkCategory );
      this.onGetModel( data.fkCategory, data.fkBrand );
    }, 1500);

    $('#btnShowVehicleVerif').trigger('click');
  }

  onSubmitVerifVehicle(frm: NgForm) {
    if (frm.valid) {
      this.loadingVehicle = true;
      this.driverSvc.onVerifyVehicle( this.bodyVehicleVerif ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loadingVehicle = false;
        if (res.showError !== 0) {
         this.onShowAlert( 'error', 'Alerta', this.onGetErrorVehicleVerif( res.showError ) );
         return;
        }

        this.onShowAlert( 'success', 'Mensaje al usuaio', 'Vehículo habilitado con éxito' );
        const finded = this.vehicles.find( vehicle => vehicle.pkVehicle === this.bodyVehicleVerif.pkVehicle );
        if (finded) {
          finded.verified = 1;
        }
        $('#btnCloseModalVehicle').trigger('click');
      });
    }
  }

  onResetVehicle() {
    this.bodyVehicleVerif.onReset();
  }

  onShowModalVerifDriver() {
    if (this.dataProfile.verified) {
      this.onShowAlert('info', 'Mensaje al usuario', 'Este conductor ya ha sido verificado');
      return;
    }

    this.bodyDriverVerif.pkDriver = this.dataProfile.pkDriver;
    this.bodyDriverVerif.observation = `Conductor verificado por: ${ this.dataUser.nameComplete }.`;
    $('#btnShowVerifDriver').trigger('click');
  }

  onSubmitVerifDriver(frm: NgForm) {
    if (frm.valid) {
      this.loadingDriver = false;
      this.driverSvc.onVerifyDriver( this.bodyDriverVerif ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.loadingDriver = false;
        if (res.showError !== 0) {
         this.onShowAlert( 'error', 'Alerta', this.onGetErrorDriver( res.showError ) );
         return;
        }

        this.onShowAlert( 'success', 'Mensaje al usuaio', 'Conductor habilitado con éxito' );
        this.dataProfile.verified = 1;
        $('#btnCloseVerifDriver').trigger('click');
      });
    }
  }

  onSubmitVehicle(frm: NgForm) {
    if (frm.valid) {
      console.log(this.bodyVehicle);
      this.loadingVehicle = true;
      if (!this.loadDataVehicle) {

        this.vehicleSvc.onAddVehicle( this.bodyVehicle ).subscribe( (res) => {
          if (!res.ok) {
            throw new Error( res.error );
          }

          this.loadingVehicle = false;
          this.onShowAlert(
            res.showError === 0 ? 'success' : 'error',
            this.onGetErrorVehicle( res.showError )
          );

          if (res.showError !== 0) {
            return;
          }

          $('#btnCloseModalVehicleAdd').trigger('click');
          this.onLoadVehicles( );
        });

      } else {

        this.vehicleSvc.onUpdateVehicle( this.bodyVehicle ).subscribe( (res) => {
          if (!res.ok) {
            throw new Error( res.error );
          }

          this.loadingVehicle = false;
          this.onShowAlert(
            res.showError === 0 ? 'success' : 'error',
            this.onGetErrorVehicle( res.showError )
          );

          if (res.showError !== 0) {
            return;
          }

          $('#btnCloseModalVehicleAdd').trigger('click');
          this.onLoadVehicles( );
        });
        //
      }
    }
  }

  onEditVehicle( id: number ) {
    this.titleModalVehicle = 'Editar vehículo';
    this.textBtnModalVehicle = 'Guardar cambios';

    const findV = this.vehicles.find( vehicle => vehicle.pkVehicle === id );
    if (!findV) {
      throw new Error('No se encontró vehículo');
    }


    this.bodyVehicle.fkDriver = this.pkDriver;
    this.bodyVehicle.fkPerson = this.dataProfile.pkPerson;
    this.bodyVehicle.pkVehicle = id;
    this.bodyVehicle.fkCategory = findV.fkCategory;
    this.bodyVehicle.fkBrand = findV.fkBrand;
    this.bodyVehicle.fkModel = findV.fkModel;

    this.bodyVehicle.numberPlate = findV.numberPlate;
    this.bodyVehicle.year = findV.year;
    this.bodyVehicle.color = findV.color;
    this.bodyVehicle.isProper = findV.isProper;
    this.bodyVehicle.verified = findV.verified;
    this.bodyVehicle.dateSoatExpiration = findV.dateSoatExpiration;
    setTimeout(() => {
      this.onGetBrand( findV.fkCategory );
      this.onGetModel( findV.fkCategory, findV.fkBrand );
    }, 1500);

    $('#btnShowModalVehicleAdd').trigger('click');
    this.loadDataVehicle = true;
  }

  onResetVehicleAdd() {
    this.bodyVehicle.onReset();
    this.loadDataVehicle = false;
    this.titleModalVehicle = 'Nuevo vehículo';
    this.textBtnModalVehicle = 'Guardar';
  }

  onCofirmDeleteVehicle( id: number ) {
    const findedV = this.vehicles.find( vehicle => vehicle.pkVehicle === id );
    if (!findedV) {
      throw new Error( 'No se encontró registro de vehículo' );
    }
    this.bodyVehicle.pkVehicle = findedV.pkVehicle;
    this.bodyVehicle.fkDriver = this.pkDriver;
    this.bodyVehicle.statusRegister = !findedV.statusRegister;

    console.log('abrir confirmación eliminar vehiculo');
  }

  onDeleteVehicle() {
    this.loadingVehicle = true;
    this.vehicleSvc.onDeleteVehicle( this.bodyVehicle ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.loadingVehicle = false;
      this.onShowAlert(
        res.showError === 0 ? 'success' : 'error',
        this.onGetErrorVehicle( res.showError, true )
      );

      if (res.showError !== 0) {
        return;
      }

      $('#btnConfirmDelVehicle').trigger('click');
      this.onLoadVehicles( );
    });
  }

  onLoadVehicles() {
    this.driverSvc.onGetVehicles( this.pkDriver ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.vehicles = res.data;
    });
  }

  onGetErrorVehicle( showError: number, isdelete = false ) {
    let action = this.loadDataVehicle ? 'actualizado' : 'registrado';
    if (isdelete) {
      action = 'eliminado';
    }

    let arrError = showError === 0 ? [`Vehículo ${ action } con éxito`] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('existe un vehiculo con este número de placa asociado a otro conductor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError = ['Error', 'no se encontró registro del conductor'];
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError = ['Error', 'el conductor se encuentra inactivo'];
    }

    return arrError.join(', ');
  }

}
