import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { ProjectVersionModel } from '../models/projectVersion.model';
import { Pagination } from '../compartido/modelos/Pagination';
import { Filters } from '../compartido/modelos/Filters';

@Injectable({
  providedIn: 'root'
})
export class ProjectVersionService {

  private urlBackend:string
  headers: HttpHeaders;
  rute = 'project-version'

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  setProjectVersion(versionProjects: ProjectVersionModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, versionProjects, { headers: this.headers } )
  }

  getProjectVersions(page: number, limit: number, filters?: Filters){
    let endpoint = `${this.rute}?page=${page}&limit=${limit}`
    if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    }
    return this.http.get<{versionProjects: ProjectVersionModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  getProjectVersion(id: number){
    let endpoint = `${this.rute}/${id}`   
    return this.http.get<any>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  updateProjectVersion(projectVersion: ProjectVersionModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, projectVersion, { headers: this.headers } )
  }

  cloneProjectVersion(id: number){
    let endpoint = `${this.rute}/clone/${id}`
    return this.http.get<ProjectVersionModel>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  getProjectVersionByProject(id:number, page?: number, limit?: number, filters?: Filters){
    let endpoint = `${this.rute}/project/${id}`
    if(page && limit){
      endpoint+=`?page=${page}&limit=${limit}`
    }
    /* if(filters){
        if(filters.term){
            endpoint+=`&term=${filters.term}`
        }
    } */
    return this.http.get<{versionProjects: ProjectVersionModel[], pagination: Pagination}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  
  cloneVersionProjectByNewProject(id: number, projectId: number){
    let endpoint = `${this.rute}/clone-project/${id}/${projectId}`
    return this.http.get<ProjectVersionModel>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

}
