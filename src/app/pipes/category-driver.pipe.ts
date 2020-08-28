import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryDriver'
})
export class CategoryDriverPipe implements PipeTransform {

  transform(code: string): string {
    let str = '';
    switch (code) {
        case 'BASIC':
            str = 'Básico';
            break;
            case 'STANDAR':
                str = 'Standar';
                break;
                case 'PREMIUM':
                    str = 'Premium';
                    break;

        default:
            str = 'No especificado';
            break;
    }

    return str;
  }

}
