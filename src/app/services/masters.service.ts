import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { StatusModel } from '../models/masters/status';
import { TypeApplicationModel } from '../models/masters/typeApplication';
import { TypeDeviceModel } from '../models/masters/typeDevice';
import { TypeItemModel } from '../models/masters/typeItem';
import { TypeProjectModel } from '../models/masters/typeProject';
import { TypeUnitModel } from '../models/masters/typeUnit';
import { ProjectStatusModel } from '../models/masters/projectStatus';

@Injectable({
  providedIn: 'root'
})
export class MastersService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'masters'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  getStatus (){
    let endpoint = `${this.rute}/status`  
    return this.http.get<{status: StatusModel[]}>(
      `${this.urlBackend}${endpoint}`, { headers: this.headers })
 }

 getTypeApplications (){
  let endpoint = `${this.rute}/typeApplication`  
  return this.http.get<{typeApplication: TypeApplicationModel[]}>(
    `${this.urlBackend}${endpoint}`, { headers: this.headers })
}

getTypeDevices (){
  let endpoint = `${this.rute}/typeDevice`  
  return this.http.get<{typeDevice: TypeDeviceModel[]}>(
    `${this.urlBackend}${endpoint}`, { headers: this.headers })
}

getTypeItems (){
  let endpoint = `${this.rute}/typeItem`  
  return this.http.get<{typeItem: TypeItemModel[]}>(
    `${this.urlBackend}${endpoint}`, { headers: this.headers })
}

getTypeProjects (){
  let endpoint = `${this.rute}/typeProject`  
  return this.http.get<{typeProject: TypeProjectModel[]}>(
    `${this.urlBackend}${endpoint}`, { headers: this.headers })
}

getTypeUnits (){
  let endpoint = `${this.rute}/typeUnit`  
  return this.http.get<{typeUnit: TypeUnitModel[]}>(
    `${this.urlBackend}${endpoint}`, { headers: this.headers })
}

getProjectStatus (){
  let endpoint = `${this.rute}/projectStatus`  
  return this.http.get<{projectStatus: ProjectStatusModel[]}>(
    `${this.urlBackend}${endpoint}`, { headers: this.headers })
}

}
