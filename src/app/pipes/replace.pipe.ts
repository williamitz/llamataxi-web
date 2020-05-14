import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, newValue: string): unknown {
    return value.replace('<br />', newValue);
  }

}
