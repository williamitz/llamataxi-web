export interface IJournalDriver {
    pkJournalDriver: number;
    fkConfigJournal: number;
    fkDriver: number;
    codeJournal: string;
    dateStart: string;
    dateEnd: string;
    journalStatus: boolean;
    totalCash: number;
    totalCard: number;
    totalCredit: number;
    totalDiscount: number;
    countService: number;
    nameJournal: string;
    rateJournal: number;
    modeJournal: string;
    nameComplete: string;
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
