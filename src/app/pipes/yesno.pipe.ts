import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesno'
})
export class YesnoPipe implements PipeTransform {

  transform(value: number): any {
    let opt = 'Sí';
    if (!value) {
      opt = 'No';
    }
    return opt;
  }

}
