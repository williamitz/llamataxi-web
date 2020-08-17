import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {

  transform(value: string): any {

    let role = 'Cliente';
    switch (value) {
      case 'WEBMASTER_ROLE':
        role = 'Admin WEB';
        break;

      case 'USER_ROLE':
        role = 'Cliente';
        break;

      case 'DRIVER_ROLE':
          role = 'Conductor';
          break;

      case 'ADMIN_ROLE':
          role = 'Administrador';
          break;

      case 'ATTENTION_ROLE':
          role = 'Att. al cliente';
          break;

      default:
        role = 'Cliente';
        break;
    }
    return role;
  }

}
