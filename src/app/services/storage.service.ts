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

  onGetItem( name: string, isJson = false ) {
    return isJson ? JSON.parse( localStorage.getItem(name) ) : localStorage.getItem(name);
  }

  onLoadToken() {
    this.token = localStorage.getItem('token') || '';
  }

  onClear() {
    localStorage.removeItem('token');
    localStorage.removeItem('dataUser');

    this.token = '';
  }
}
