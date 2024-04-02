import { Injectable } from '@angular/core';
import { ClientModel } from '../models/client.model';
import { Pagination } from '../compartido/modelos/Pagination';
import { Filters } from '../compartido/modelos/Filters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'client'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  setClient(client: ClientModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, client, { headers: this.headers } )
  }

  getClients(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{clients: ClientModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateClient(client: ClientModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, client, { headers: this.headers } )
  }


}
