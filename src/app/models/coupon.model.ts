export class CouponModel {
    pkCoupon: number;
    codeCoupon: string;
    titleCoupon: string;
    descriptionCoupon: string;
    minRateService: number;
    amountCoupon: number;
    dateExpiration: string;
    daysExpiration: number;
    roleCoupon: string;
    statusRegister: boolean;
    dateRegister: string;

    constructor() {
        this.pkCoupon = 0;
        this.codeCoupon = '';
        this.titleCoupon = '';
        this.descriptionCoupon = '';
        this.minRateService = 0;
        this.amountCoupon = 0;
        this.dateExpiration = '';
        this.daysExpiration = 7;
        this.roleCoupon = 'CLIENT_ROLE';
        this.statusRegister = true;
        this.dateRegister = '';
    }

    onReset() {
      this.pkCoupon = 0;
      this.codeCoupon = '';
      this.titleCoupon = '';
      this.descriptionCoupon = '';
      this.minRateService = 0;
      this.amountCoupon = 0;
      this.dateExpiration = '';
      this.daysExpiration = 7;
      this.roleCoupon = 'CLIENT_ROLE';
  }
}
