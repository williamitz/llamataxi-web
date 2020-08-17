import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from '../../../services/chart.service';
import { Subscription } from 'rxjs';
import { IChartCards, IChartServices } from 'src/app/interfaces/chart.interface';
import { SingleDataSet, Label, Colors } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { SocketService } from '../../../services/socket.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { IChartUsers } from '../../../interfaces/chart.interface';
import * as $ from 'jquery';
import { IMonth } from 'src/app/interfaces/picker.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  charSbc: Subscription;
  charServSbc: Subscription;
  charUserSbc: Subscription;
  trafficSbc: Subscription;
  newUsersSbc: Subscription;
  newServicesSbc: Subscription;
  delServicesSbc: Subscription;
  newVerifiedSbc: Subscription;

  dataCards: IChartCards = {
    currentTraffic: 0,
    oldTraffic: 0,
    percentTraffic: 0,
    currentNewUsers: 0,
    oldNewUsers: 0,
    percentNewUsers: 0,
    currentServices: 0,
    oldServices: 0,
    percentServices: 0,
    currentVerified: 0,
    oldVerified: 0,
    percentVerified: 0,
    currentDate: 0,
    oldMonth: 0,
    oldYear: 0,
    currentMonth: 0,
    currentYear: 0,
  };

  dataChartService: IChartServices = {
    pending: 0,
    transit: 0,
    finished: 0,
    canceled: 0
  };

  dataChartUsers: IChartUsers = {
    clients: 0,
    drivers: 0
  };

  // PolarArea
  polarAreaChartLabels: Label[] = ['Pendientes', 'En tránsito', 'Finalizados', 'Cancelados'];
  polarAreaChartData: SingleDataSet = [];
  polarAreaLegend = true;

  polarAreaChartType: ChartType = 'polarArea';
  polarOpt: ChartOptions = {
    responsive: true,
    legend: {
      labels: { fontColor: '#FFF', fontSize: 15 },
      align: 'start',
      position: 'left'
    },

    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return value;
        },
        color: '#FFF'
      },
    }
  };

  polarChartColors = [
    {
      backgroundColor: [
        'rgba(240, 255, 29, 0.5)',
        'rgba(0, 245, 74, 0.5)',
        'rgba(29, 202, 255, 0.5)',
        'rgba(252, 0, 0, 0.5)'
      ],
      borderColor: [
        'rgba(240, 255, 29, 0.5)',
        'rgba(0, 245, 74, 0.5)',
        'rgba(29, 202, 255, 0.5)',
        'rgba(252, 0, 0, 0.5)'
      ]
    },
  ];


  // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: { fontSize: 15 },
      align: 'center',
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return value;
        }
      },
    }
  };
  pieChartLabels: Label[] = ['Clientes', 'Conductores'];
  pieChartData: number[] = [0, 0];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [pluginDataLabels];
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  // months
  dataMonth: IMonth[] = [
    { text: 'Enero', value: 1 },
    { text: 'Febrero', value: 2 },
    { text: 'Marzo', value: 3 },
    { text: 'Abril', value: 4 },
    { text: 'Mayo', value: 5 },
    { text: 'Junio', value: 6 },
    { text: 'Julio', value: 7 },
    { text: 'Agosto', value: 8 },
    { text: 'Setiembre', value: 9 },
    { text: 'Octubre', value: 10 },
    { text: 'Noviembre', value: 11 },
    { text: 'Diciembre', value: 12 },
  ];

  // years
  dataYears: number[] = [];
  startYear = 2020;
  currentYear = moment().year();
  polarYear = moment().year();
  polarMonth = moment().month() + 1;
  polarLoading = false;

  pieYear = moment().year();
  pieMonth = moment().month() + 1;
  pieLoading = false;

  constructor( private chartSvc: ChartService, private io: SocketService ) { }

  ngOnInit() {
    this.onLoadCards();
    this.onLoadUsers();
    this.onLoadServices();
    this.onLoadYears();
  }

  onLoadYears() {
    for (let index = this.startYear; index <= this.currentYear; index++) {
      this.dataYears.push( index );
    }
  }

  onLoadCards() {
    this.charSbc = this.chartSvc.onGetCards().subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      const data: any = res.data;
      this.dataCards = data;

      this.onListenTraffic();
      this.onListenNewUser();
      this.onListenNewService();
      this.onListenNewVerfified();
    });
  }
  onLoadServices() {
    this.polarLoading = true;
    this.charServSbc = this.chartSvc.onGetServices( this.polarMonth, this.polarYear ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.polarLoading = false;

      const data: any = res.data;
      this.dataChartService = data;
      this.polarAreaChartData = [];
      this.polarAreaChartData.push( this.dataChartService.pending );
      this.polarAreaChartData.push( this.dataChartService.transit );
      this.polarAreaChartData.push( this.dataChartService.finished );
      this.polarAreaChartData.push( this.dataChartService.canceled );
    });
  }

  onLoadUsers() {
    this.pieLoading = true;
    this.charUserSbc = this.chartSvc.onGetUsers( this.pieMonth, this.pieYear ).subscribe( (res) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.pieLoading = false;

      const data: any = res.data;
      this.dataChartUsers = data;

      this.pieChartData = [];
      this.pieChartData.push( this.dataChartUsers.clients );
      this.pieChartData.push( this.dataChartUsers.drivers );

    });
  }

  onListenTraffic() {
    // new-traffic
    this.trafficSbc = this.io.onListen('current-new-traffic').subscribe( (res) => {
      const oldTraffic = this.dataCards.oldTraffic;
      const currentTraffic = this.dataCards.currentTraffic + 1;

      this.dataCards.currentTraffic += 1;
      this.dataCards.percentTraffic = ( currentTraffic * oldTraffic ) / 100;

    });
  }

  onListenNewUser() {
    // new-traffic
    this.newVerifiedSbc = this.io.onListen('current-new-user').subscribe( (res) => {
      const oldNewUsers = this.dataCards.oldNewUsers;
      const currentNewUsers = this.dataCards.currentNewUsers + 1;

      this.dataCards.currentNewUsers += 1;
      this.dataCards.percentNewUsers = ( currentNewUsers * oldNewUsers ) / 100;

    });
  }

  onListenNewService() {
    // new-traffic
    this.newServicesSbc = this.io.onListen('current-new-service').subscribe( (res) => {
      const oldServices = this.dataCards.oldServices;
      const currentServices = this.dataCards.currentServices + 1;

      this.dataCards.currentServices += 1;
      this.dataCards.percentServices = ( currentServices * oldServices ) / 100;

    });
  }

  onListenDelService() {
    // new-traffic
    this.delServicesSbc = this.io.onListen('current-del-service').subscribe( (res) => {

      this.polarAreaChartData[0] = this.polarAreaChartData[0] || 0 - 1;
      this.polarAreaChartData[3] = this.polarAreaChartData[3] || 0 + 1;

    });
  }

  onListenNewVerfified() {
    // new-traffic
    this.newServicesSbc = this.io.onListen('current-new-verfified').subscribe( (res) => {
      const oldVerified = this.dataCards.oldVerified;
      const currentVerified = this.dataCards.currentVerified + 1;

      this.dataCards.currentVerified += 1;
      this.dataCards.percentVerified = ( currentVerified * oldVerified ) / 100;

    });
  }

  ngOnDestroy() {
    this.charSbc.unsubscribe();
    this.charServSbc.unsubscribe();

    if (this.trafficSbc) {
      this.trafficSbc.unsubscribe();
    }

    if (this.newUsersSbc) {
      this.newUsersSbc.unsubscribe();
    }

    if (this.newServicesSbc) {
      this.newServicesSbc.unsubscribe();
    }

    if (this.newServicesSbc) {
      this.newServicesSbc.unsubscribe();
    }

    if (this.delServicesSbc) {
      this.delServicesSbc.unsubscribe();
    }

  }

}
