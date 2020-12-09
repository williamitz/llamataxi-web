import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payments'
})
export class PaymentsPipe implements PipeTransform {

  transform(value: string): unknown {

    let str = '<i class="fas fa-hand-holding-usd"></i>';

    switch (value) {
      case 'CASH':
        str = 'Efectivo';
        break;
        case 'CARD':
          str = 'Tarjeta';
          break;

        case 'CRED':
          str = 'Llamacréditos';
          break;

      default:
        break;
    }
    return str;
  }

}
