import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modeJournal'
})
export class ModeJournalPipe implements PipeTransform {

  transform(value: string): string {

    let out = '';

    switch (value) {
      case 'FORTODAY':
        out = '24 horas';
        break;
        case 'FORSERVI':
          out = 'Por servicio';
          break;
      default:
        out = 'no especificado';
        break;
    }

    return out;
  }

}
