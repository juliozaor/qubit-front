import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { CategoryModel } from '../models/category.model';
import { Filters } from '../compartido/modelos/Filters';
import { Pagination } from '../compartido/modelos/Pagination';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'category'
  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  
  setCategory(category: CategoryModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, category, { headers: this.headers } )
  }

  getcategories(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{categories: CategoryModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateCategory(category: CategoryModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, category, { headers: this.headers } )
  }

  getcategory(id: number){
    let endpoint = `${this.rute}/${id}`
    return this.http.get<CategoryModel>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }


}
