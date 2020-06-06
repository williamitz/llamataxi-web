import { Injectable } from '@angular/core';
import { IUserStorage } from '../interfaces/user-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public token = '';
  public dataUser: IUserStorage = {
    pkUser: 0,
    userName: '',
    nameComplete: '',
    email: '',
    phone: '',
    img: '',
    role: '',
  };
  constructor( ) { }

  onSaveCredentials( token: string, data: any ) {
    this.token = token;
    this.dataUser = data;
    localStorage.setItem('token', token);
    localStorage.setItem('dataUser', JSON.stringify( data ));
  }

  onGetItem( name: string, isJson = false ) {
    return isJson ? JSON.parse( localStorage.getItem(name) ) : localStorage.getItem(name);
  }

  onLoadToken() {
    this.token = localStorage.getItem('token') || '';
  }

  onLoadData() {
    this.dataUser = JSON.parse( localStorage.getItem('dataUser') ) ;
  }

  onClear() {
    localStorage.removeItem('dataUser');
    localStorage.removeItem('token');

    this.token = '';
    this.dataUser = {
      pkUser: 0,
      userName: '',
      nameComplete: '',
      email: '',
      phone: '',
      img: '',
      role: '',
    };
  }
}
