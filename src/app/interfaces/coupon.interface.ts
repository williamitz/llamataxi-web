export interface ICoupon {
    pkCoupon: number;
    titleCoupon: string;
    roleCoupon: string;
    descriptionCoupon: string;
    codeCoupon: string;
    minRateService: number;
    amountCoupon: number;
    dateExpiration: string;
    daysExpiration: number;
    statusRegister: boolean;
    dateRegister: string;
}
