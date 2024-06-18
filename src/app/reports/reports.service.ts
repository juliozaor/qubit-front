import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private urlBackend:string
  headers: HttpHeaders;
  
  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  getgroupsItems(){
    const rute = 'group-items/groups'
    let endpoint = `${rute}`    
    return this.http.get<{groupItems: any}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

}
