import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { ProjectModel } from '../models/project.model';
import { Filters } from '../compartido/modelos/Filters';
import { Pagination } from '../compartido/modelos/Pagination';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
   
  private urlBackend:string
  headers: HttpHeaders;
  rute = 'project'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  setProject(project: ProjectModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, project, { headers: this.headers } )
  }

  getProjects(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{projects: ProjectModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateProject(project: ProjectModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, project, { headers: this.headers } )
  }


}
