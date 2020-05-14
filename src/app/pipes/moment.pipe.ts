import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
moment.locale('es');
@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(date: string, format = 'MMM DD YYYY, h:mm:ss a'): unknown {
    console.log(date);
    const newDate = moment(date).format(format) || 'error';
    return newDate.charAt(0).toUpperCase() + newDate.slice(1);
  }

}
