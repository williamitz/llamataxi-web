import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paidOut'
})
export class PaidOutPipe implements PipeTransform {

  transform(value: boolean): unknown {
    return value ? 'Pagó' : 'Debe';
  }

}
