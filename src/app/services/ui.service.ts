import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private router: Router) { }

  onShowNotification(title: string, msg: string, icon = './assets/img/logo.png', urlShow = '') {
    let notification = null;

    if (!('Notification' in window)) {
        // el navegador no soporta la API de notificaciones
        Swal.fire({
          position: 'top-end',
          title: 'Su navegador no soporta la API de Notificaciones :(',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        return;
    } else if (Notification.permission === 'granted') {
      // Se puede emplear las notificaciones
      notification = new Notification( title, { icon, body: msg });
      notification.addEventListener('click', () => {
        if (urlShow !== '') {
          this.router.navigateByUrl(urlShow);
        }
      });

    } else if (Notification.permission !== 'denied') {
      // se pregunta al usuario para emplear las notificaciones
      Notification.requestPermission().then( (permission) => {
          if (permission === 'granted') {
            notification = new Notification( title, { icon, body: msg });
            notification.addEventListener('click', () => {
              if (urlShow !== '') {
                this.router.navigateByUrl(urlShow);
              }
            });
          }
      }).catch(e => {
        console.error('Error al solicitar permiso para usar notificaciones', e)
      });
    }

  }
}
