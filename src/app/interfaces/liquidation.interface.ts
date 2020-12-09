export interface IJournalDriver {
    pkJournalDriver: number;
    fkConfigJournal: number;
    fkDriver: number;
    codeJournal: string;
    dateStart: string;
    dateEnd: string;
    journalStatus: boolean;
    paidOut: boolean;
    datePaid: string;
    illPay: boolean;
    totalDebt: number;
    totalCash: number;
    totalCard: number;
    totalCredit: number;
    totalDiscount: number;
    countService: number;
    nameJournal: string;
    rateJournal: number;
    modeJournal: string;
    nameComplete: string;
    totalPay: number;

    img: string;
    fkLiquidation: number;
    liquidated: boolean;
    dateLiquidated: string;
    pkUser: number;
}


export interface IAccountDriver {
    pkAccountDriver: number;
    ccAccount: string;
    cciAccount: string;
    fkBank: number;
    bankName: string;
    bankAlias: string;
    dateRegister: string;
}
