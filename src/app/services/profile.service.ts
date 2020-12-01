import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../interfaces/response.interface';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment.prod';
import { ProfileModel } from '../models/profile.model';

const URI_API = environment.URL_SERVER;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient, private st: StorageService) {}

  onGetProfile() {
    return this.http.get<IResponse>(URI_API + `/Profile/Web`, {
      headers: { Authorization: this.st.token },
    });
  }

  onUpdateProfile( body: ProfileModel ) {
    return this.http.put<IResponse>(URI_API + `/Profile/Web`, body, {
      headers: { Authorization: this.st.token },
    });
  }

}
