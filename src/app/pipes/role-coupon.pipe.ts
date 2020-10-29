import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleCoupon'
})
export class RoleCouponPipe implements PipeTransform {

  transform(value: string, ): string {
    return value === 'CLIENT_ROLE' ? 'Cliente' : 'Conductor';
  }

}
