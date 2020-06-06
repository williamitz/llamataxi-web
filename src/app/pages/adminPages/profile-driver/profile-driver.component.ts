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
import { DriverProfileModel } from 'src/app/models/user.model';
import { INationality } from '../../../interfaces/nationality.interface';
import { ITypeDocument } from '../../../interfaces/type-document.interface';
import { UserService } from '../../../services/user.service';
import { IRespReniec } from '../../../interfaces/reniec.interface';

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
  bodyDriver: DriverProfileModel;
  criminalIsPdf = false;
  policialIsPdf = false;
  fileProfile: File;

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
  loadingReniec = false;
  loadingImg = false;

  replaceFile: File = null;
  bodyVehicle: VehicleDriverModel;
  filesValid = ['PNG', 'JPG', 'JPEG', 'PDF'];
  imgValid = ['PNG', 'JPG', 'JPEG'];
  titleModalVehicle = 'Nuevo vehículo';
  textBtnModalVehicle = 'Guardar';
  loadDataVehicle = false;
  bodyDisabled = {
    status: true,
    observation: ''
  };
  txtBtnDisabled = 'Deshabilitar';
  actionDisabled = 'deshabilitada';
  cssBtnDisabled = 'danger';
  iconBtnDisabled = 'fa-user-times'; // fa-user-chec
  loadingDisabled = false;

  dataNationality: INationality[] = [];
  longitudeTD = 8;

  dataTypeDoc: ITypeDocument[] = [];
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
  constructor(private router: ActivatedRoute, private driverSvc: DriverService, private storage: StorageService, private msgSvc: MessageService, private brandSvc: BrandService, private vehicleSvc: VehicleDriverService, private userSvc: UserService) { }

  ngOnInit() {
    // $('.toot').trigger('tooltip');
    this.storage.onLoadToken();
    this.storage.onLoadData();
    this.token = `?token=${ this.storage.token }`;
    this.dataUser = this.storage.onGetItem('dataUser', true);
    this.pkDriver = Number( this.router.snapshot.params.id ) || 0;
    this.bodyVehicle = new VehicleDriverModel( this.pkDriver );
    this.onGetProfile( this.pkDriver );
    this.bodyMessage = new MessageModel(true);
    this.bodyResponse = new MessageModel( true );
    this.bodyVehicleVerif = new VehicleVerifModel();
    this.bodyDriverVerif = new DriverVerif();
    this.bodyDriver = new DriverProfileModel();

    this.onGetCategory();
    this.onLoadYears();
    this.onLoadTypeDoc();
    this.onLoadNationality();
    // console.log(this.router.snapshot.data);
  }

  onLoadYears() {
    for (let index = this.nowYear - 15 ; index <= this.nowYear; index++) {
      this.dataYears.push( index );
    }
  }

  onChangeDocument() {

    if ( this.bodyDriver.fkTypeDocument === 1 && this.bodyDriver.document.length === 8 ) {
      this.loadingReniec = true;
      this.userSvc.onGetReniec( this.bodyDriver.document ).subscribe( (res: IRespReniec) => {
        this.loadingReniec = false;
        if (!res) {
          console.log(' no encontrado');
          this.bodyDriver.verifyReniec = false;
          return;
        }
        console.log(res);
        this.bodyDriver.verifyReniec = true;
        this.bodyDriver.name = res.nombres,
        this.bodyDriver.surname = `${ res.apellido_paterno } ${ res.apellido_materno }`;
      });
    }
  }

  onGetProfile( id: number ) {
    Swal.fire({title: 'Espere...'});
    Swal.showLoading();
    this.driverSvc.onGetProfile( id ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data.profile;
      this.vehicles = res.data.vehicles;
      this.bodyVehicle.fkPerson = this.dataProfile.pkPerson || 0;
      // this.bodyDriver.img = URI_API + `/User/Img/Get/${ this.dataProfile.img }${ this.token }`;
      this.txtBtnDisabled = this.dataProfile.statusRegister ? 'Deshabilitar' : 'Habilitar';
      this.cssBtnDisabled = this.dataProfile.statusRegister ? 'danger' : 'success';
      this.iconBtnDisabled = this.dataProfile.statusRegister ? 'fa-user-times' : 'fa-user-check';
      this.onShowPreviewPdf();
      Swal.close();
      this.onGetMessages();
    });
  }

  onDisabledUser() {
    this.bodyDisabled.status = !this.dataProfile.statusRegister;
    this.actionDisabled = this.bodyDisabled.status ? 'habilitado' : 'des-habilitado';
    this.bodyDisabled.observation = `Conductor ${ this.actionDisabled } por ${ this.storage.dataUser.nameComplete }`;
  }

  onSubmitDeleteUser() {
    this.loadingDisabled = true;
    // tslint:disable-next-line: max-line-length
    this.driverSvc.onDeleteDriver( this.dataProfile.pkUser, this.dataProfile.pkDriver, this.bodyDisabled.status, this.bodyDisabled.observation ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.loadingDisabled = false;
      if (res.showError === 0) {
        this.dataProfile.statusRegister = !this.dataProfile.statusRegister;
        this.txtBtnDisabled = this.dataProfile.statusRegister ? 'Deshabilitar' : 'Habilitar';
        this.cssBtnDisabled = this.dataProfile.statusRegister ? 'danger' : 'success';
        this.iconBtnDisabled = this.dataProfile.statusRegister ? 'fa-user-times' : 'fa-user-check';
      }

      this.onShowAlert( res.showError === 0 ? 'success' : 'error', this.onGetErrorDelete( res.showError ) );
      $('#btnCloseConfirmUser').trigger('click');
    });
  }

  onGetErrorDelete( showError: number ) {
    const arrError = showError === 0 ? [`Conductor ${ this.actionDisabled } con éxito`] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del conductors');
    }

    return arrError.join(', ');
  }

  onGetCategory() {
    this.brandSvc.onGetListAllCategory().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataCategory = res.data;
    });
  }

  onGetBrand( fkCategory: number ) {
    this.brandSvc.onGetBrandAll( fkCategory ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataBrand = res.data;
    });
  }

  onGetModel( fkCategory: number , fkBrand: number) {
    this.brandSvc.onGetModelAll( fkCategory, fkBrand ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataModel = res.data;
    });

  }

  onGetMessages() {
    this.msgSvc.onGetMessages( this.dataProfile.pkUser, 1, 10, true ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMsg = res.data;
    });
  }

  onShowPreviewPdf() {
    this.criminalIsPdf = false;
    this.policialIsPdf = false;
    if (!this.dataProfile.isEmployee) {

      const arrCriminal: string[] = !this.dataProfile.imgCriminalRecord ? [''] :  this.dataProfile.imgCriminalRecord.split('.');
      const extCriminal = arrCriminal[ arrCriminal.length - 1 ];

      const arrPolicial: string[] = !this.dataProfile.imgPolicialRecord ? [''] : this.dataProfile.imgPolicialRecord.split('.');
      const extPolicial = arrPolicial[ arrPolicial.length - 1 ];

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

  onGetErrorDriverPF( showError: number ) {
    const arrError = showError === 0 ? ['Perfil actualizado con éxito'] : ['Error'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrError.push('no se encontró registro del conductor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrError.push('este usuario no es un conductor');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrError.push('ya existe un usuario con este email');
    }

    return arrError.join(', ');
  }

  onShowViewMsg( pkMessage: number ) {
    this.dataViewMsg = this.dataMsg.find( msg => msg.pkMessage === pkMessage );
    this.bodyResponse.pkMessage = this.dataViewMsg.pkMessage;
    this.bodyResponse.fkUserReceptor = this.dataProfile.pkUser;
    this.msgSvc.onGetResponseMsg( pkMessage ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMsgRes = res.data;

    });
    $('#btnShowViewMsgModal').trigger('click');
  }

  onSubmitMsgRes(frmMsgRes: NgForm) {
    if (frmMsgRes.valid) {

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

  onEditProfile() {
    this.bodyDriver.pkDriver = this.pkDriver;
    this.bodyDriver.pkUser = this.dataProfile.pkUser;
    this.bodyDriver.pkPerson = this.dataProfile.pkPerson;
    this.bodyDriver.img = URI_API + `/User/Img/Get/${ this.dataProfile.img }${ this.token }`;
    this.bodyDriver.fkTypeDocument = this.dataProfile.fkTypeDocument;
    this.bodyDriver.fkNationality = this.dataProfile.fkNationality;
    this.bodyDriver.document = this.dataProfile.document;
    this.bodyDriver.birthDate = this.dataProfile.brithDate;
    this.bodyDriver.name = this.dataProfile.name;
    this.bodyDriver.surname = this.dataProfile.surname;
    this.bodyDriver.email = this.dataProfile.email;
    this.bodyDriver.phone = this.dataProfile.phone;
    this.bodyDriver.sex = this.dataProfile.sex || 'M';

    // console.table({
    //   'expiration date': this.dataProfile.dateLicenseExpiration.replace('T', ' '),
    //   'moment date': moment( this.dataProfile.dateLicenseExpiration.replace('T', ' ') ).format('MM-DD-YYYY'),
    // });
    this.bodyDriver.dateLicenseExpiration = moment( this.dataProfile.dateLicenseExpiration.replace('T', ' ') ).format('YYYY-MM-DD') || '';
    this.bodyDriver.isEmployee = this.dataProfile.isEmployee;
  }

  onChangeFileProfile(file: FileList) {

    this.fileProfile = file.item(0);
    const nombre = (file.item(0).name).toUpperCase();
    const arrNombre = nombre.split('.');
    const extension =  arrNombre[ arrNombre.length - 1 ] ;
    let msg = '';
    let verifyFile = true;
    console.log('ext img', extension);
    if ( !this.filesValid.includes( extension ) ) {
        msg = `Solo se aceptan archivos de tipo ${ this.filesValid.join(', ') }`;
        verifyFile = false;
    }

    if ( (file.item(0).size / 1000000 ) > 1 ) {
      msg = 'Solo se aceptar archivos con un tamaño máximo de 1 mb';
      verifyFile = false;
    }

    if (!verifyFile) {
      this.onShowAlert('warning', 'Alerta', msg);
      return;
    }

    console.log('cambiando imagen', file.item(0));
    this.loadingImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.bodyDriver.img = event.target.result;
      this.loadingImg = false;
    };
    reader.readAsDataURL(this.fileProfile);
  }


  onSubmitEditProfile( frm: NgForm ) {
    if (frm.valid) {
      this.loadingDriver = true;

      this.driverSvc.onUpdateProfile( this.bodyDriver ).subscribe( (res) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.onShowAlert( res.showError === 0 ? 'success' : 'error',
                        'Mensaje al usuario',
                        this.onGetErrorDriverPF( res.showError ) );
        if (res.showError !== 0) {
          return;
        }

        if (this.fileProfile) {
          this.userSvc.onUpload( this.bodyDriver.pkUser, this.fileProfile ).subscribe( (resUpload) => {
            if (!resUpload.ok) {
              throw new Error( resUpload.error );
            }

            this.loadingDriver = false;
            this.dataProfile.img = resUpload.data[0].nameFile || '';
            this.fileProfile = null;
          });
        }
        this.loadingDriver = false;
        this.onGetProfile( this.pkDriver );
        this.fileProfile = null;
        $('#btnCloseModalProfile').trigger('click');

      });
    }
  }

  onLoadNationality() {
    this.userSvc.onGetNationalityAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;

    });
  }

  onLoadTypeDoc() {
    this.userSvc.onGetTypeDocumentAll().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeDoc = res.data;

    });
  }

  onChangeTypeDoc( fkTypeDoc: number ) {
    const finded = this.dataTypeDoc.find( td => Number( td.pkTypeDocument ) === Number( fkTypeDoc ) );
    if (!finded) {
      throw new Error( 'No se encontró registro ' );
    }

    this.longitudeTD = finded.longitude;
  }

}
