import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payments'
})
export class PaymentsPipe implements PipeTransform {

  transform(value: string): unknown {

    let str = '<i class="fas fa-hand-holding-usd"></i>';

    switch (value) {
      case 'CASH':
        str = '<i class="fas fa-hand-holding-usd bg-gradient-success"></i>';
        break;
        case 'CARD':
          str = '<i class="fas fa-money-check bg-gradient-info"></i>';
          break;

        case 'CRED':
          str = '<i class="far fa-credit-card bg-gradient-danger"></i>';
          break;

      default:
        break;
    }
    return str;
  }

}
