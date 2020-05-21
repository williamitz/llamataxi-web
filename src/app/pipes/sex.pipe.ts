import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(value: string): unknown {
    let gender = 'OTRO';
    switch (value) {
      case 'M':
        gender = 'Masculino';
        break;
        case 'F':
          gender = 'Femenino';
          break;

      default:
        gender = 'OTRO';
        break;
    }

    return gender;
  }

}
