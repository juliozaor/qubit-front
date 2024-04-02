import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { Filters } from '../compartido/modelos/Filters';
import { Pagination } from '../compartido/modelos/Pagination';
import { ItemIGroupModel } from '../models/itemIGroup.model';

@Injectable({
  providedIn: 'root'
})
export class ItemIGroupService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'items_i_group'
  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  getgroupItems(id:number,page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}/group/${id}?page=${page}&limit=${limit}`
   /*  if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    } */
    return this.http.get<{groupIItems: any[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateItem(groupItem: ItemIGroupModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, groupItem, { headers: this.headers } )
  }

  setItem(groupItem: ItemIGroupModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, groupItem, { headers: this.headers } )
  }

  deleteGroupItem(id: number){
    let endpoint = `${this.rute}/${id}`
    return this.http.delete<any>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  cloneGroupIItem(idOld: number, idNew: number){
    let endpoint = `${this.rute}/clone/${idOld}/${idNew}`
    return this.http.get<{message: string}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }


}
