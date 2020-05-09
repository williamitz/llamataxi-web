import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public token = '';
  constructor() { }

  onSaveCredentials( token: string, data: any[] ) {
    this.token = token;
    localStorage.setItem('token', token);
    localStorage.setItem('dataUser', JSON.stringify( data ));
  }

  onLoadToken() {
    this.token = localStorage.getItem('token') || '';
  }
}
