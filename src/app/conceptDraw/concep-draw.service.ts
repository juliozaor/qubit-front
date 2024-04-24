import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { ConceptDrawModel } from '../models/conceptDraw.model';
import { Pagination } from '../compartido/modelos/Pagination';
import { Filters } from '../compartido/modelos/Filters';

@Injectable({
  providedIn: 'root'
})
export class ConcepDrawService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'concept-draw'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  setConceptDraw(conceptDraw: ConceptDrawModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, conceptDraw, { headers: this.headers } )
  }

  getConceptDraws(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{conceptDraws: ConceptDrawModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateConceptDraw(conceptDraw: ConceptDrawModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, conceptDraw, { headers: this.headers } )
  }


}
