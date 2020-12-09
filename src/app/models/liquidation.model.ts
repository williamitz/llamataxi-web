export class LiquidationModel {
    pkLiquidation: number;
    fkJournalDriver: number;
    fkDriver: number;
    operation: string;
    observation: string;
    amountCompany: number;
    haveDebt: boolean;
    fkAccount: number;
    totalDebt: number;
    totalPay: number;
    totalLiquidation: number;
    paidOut: boolean;

    // data view
    nameComplete: string;
    img: string;
    codeJournal: string;
    dateStart: string;
    dateEnd: string;
    nameJournal: string;
    rateJournal: number;
    osId: string;

    constructor() {
        this.pkLiquidation = 0;
        this.fkJournalDriver = 0;
        this.fkDriver = 0;
        this.operation = '';
        this.observation = '';
        this.amountCompany = 0;
        this.haveDebt = false;
        this.paidOut = false;
        // this.fkAccount = 0;
        this.nameComplete = '';
        this.img = '';
        this.codeJournal = '';
        this.dateStart = '';
        this.dateEnd = '';
        this.nameJournal = '';
        this.rateJournal = 0;
        this.totalDebt = 0;
        this.totalPay = 0;
        this.totalLiquidation = 0;
        this.osId = '';
    }
    
    onReset() {
        this.osId = '';
        this.pkLiquidation = 0;
        this.totalLiquidation = 0;
        this.paidOut = false;
        this.fkJournalDriver = 0;
        this.fkDriver = 0;
        this.totalDebt = 0;
        this.totalPay = 0;
        this.operation = '';
        this.observation = '';
        this.amountCompany = 0;
        this.haveDebt = false;
        // this.fkAccount = 0;
        this.nameComplete = '';
        this.img = '';
        this.codeJournal = '';
        this.dateStart = '';
        this.dateEnd = '';
        this.nameJournal = '';
        this.rateJournal = 0;
    }
}

export interface IServiceJournal {
    pkService: number;
    distanceText: string;
    minutesText: string;
    paymentType: string;
    rateService: number;
    discount: number;
}
