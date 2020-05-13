import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }
}
