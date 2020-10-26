export class CouponModel {
    pkCoupon: number;
    codeCoupon: string;
    title: string;
    description: string;
    minRateService: number;
    amountCoupon: number;
    dateExpiration: string;
    daysExpiration: number;
    role: string;

    constructor() {
        this.pkCoupon = 0;
        this.codeCoupon = '';
        this.title = '';
        this.description = '';
        this.minRateService = 0;
        this.amountCoupon = 0;
        this.dateExpiration = '';
        this.daysExpiration = 7;
        this.role = 'CLIENT';
    }
}
