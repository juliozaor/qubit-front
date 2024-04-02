import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { ItemGroupModel } from '../models/itemGroup.model';
import { Pagination } from '../compartido/modelos/Pagination';
import { Filters } from '../compartido/modelos/Filters';

@Injectable({
  providedIn: 'root'
})
export class ItemGroupService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'group-items'
  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  
  setItem(groupItem: ItemGroupModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, groupItem, { headers: this.headers } )
  }

  getgroupItems(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{groupItems: ItemGroupModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateItem(groupItem: ItemGroupModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, groupItem, { headers: this.headers } )
  }

  getgroupItem(id: number){
    let endpoint = `${this.rute}/${id}`
    return this.http.get<ItemGroupModel>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }


  clonegroupItem(id: number){
    let endpoint = `${this.rute}/clone/${id}`
    return this.http.get<ItemGroupModel>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }


}
