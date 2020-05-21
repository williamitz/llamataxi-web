import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userUrl'
})
export class UserUrlPipe implements PipeTransform {

  transform(role: string, pkUser: number, pkDriver: number): unknown {
    let url = '/admin/';
    switch (role) {
      case 'DRIVER_ROLE':
        url += `profileDriver/${ pkDriver }`;
        break;

      default:
        url += `profileUser/${ pkUser }`;
        break;
    }
    return url;
  }

}
