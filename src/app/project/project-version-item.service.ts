import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { ItemIGroupVersionModel } from '../models/itemIGroupVersion.model';
import { Filters } from '../compartido/modelos/Filters';
import { Pagination } from '../compartido/modelos/Pagination';

@Injectable({
  providedIn: 'root'
})
export class ItemIGroupVersionItemService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'items_i_group_version'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  setItemIGroup(itemIGroup: ItemIGroupVersionModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, itemIGroup, { headers: this.headers } )
  }

  getItemIGroups(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{itemIGroups: ItemIGroupVersionModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  getVersionByGroups(versionId:number, filters?: Filters){
    
    let endpoint = `${this.rute}/group/${versionId}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{groupIItemVersions: {}, pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateItemIGroup(itemIGroup: ItemIGroupVersionModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, itemIGroup, { headers: this.headers } )
  }

  addGroupIItem(projectId: number, groupId: number){
    let endpoint = `${this.rute}/add/${projectId}/${groupId}`
    return this.http.get<{message: string}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

}
