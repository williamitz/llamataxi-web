import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
moment.locale('es');
@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(date: string, format = 'MMM DD YYYY, h:mm:ss a', relative = false): unknown {
    console.log(date);
    let newDate = '';
    if (relative) {
      newDate = moment(date).fromNow() || 'error';
    } else {
      newDate = moment(date).format(format) || 'error';
    }
    const outStr = newDate.charAt(0).toUpperCase() + newDate.slice(1);
    return outStr.replace( '.', '' );
  }

}
