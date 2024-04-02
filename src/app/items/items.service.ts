import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ItemModel } from '../models/item.model';
import { Filters } from '../compartido/modelos/Filters';
import { Pagination } from '../compartido/modelos/Pagination';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'items'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  setItem(item: ItemModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, item, { headers: this.headers } )
  }

  getItems(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{items: ItemModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateItem(item: ItemModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, item, { headers: this.headers } )
  }


}
