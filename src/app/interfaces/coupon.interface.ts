export interface ICoupon {
    pkCoupon: number;
    codeCoupon: string;
    minRateService: number;
    amountCoupon: number;
    dateExpiration: string;
    daysExpiration: number;
    statusRegister: boolean;
    dateRegister: string;
}
