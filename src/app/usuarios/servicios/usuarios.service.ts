import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PeticionCrearUsuario } from '../modelos/PeticionCrearUsuario';
import { Autenticable } from '../../services/compartido/Autenticable';
import { PeticionActualizarUsuario } from '../modelos/PeticionActualizarUsuario';
import { FiltrosUsuarios } from '../modelos/FiltrosUsuarios';
import { Usuario } from '../modelos/Usuario';
import { Pagination } from '../../compartido/modelos/Pagination';
import { Rol } from '../modelos/Rol';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  guardar(peticion: PeticionCrearUsuario){
    const endpoint = 'users/registro'
    return this.http.post(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() } )
  }

  actualizar(documento: string, peticion: PeticionActualizarUsuario){
    const endpoint = `users/${documento}`
    return this.http.patch(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() } )
  }

  listar(pagina: number, limite: number, filtros?: FiltrosUsuarios){
    let endpoint = `users/listar?pagina=${pagina}&limite=${limite}`
    if(filtros){
        if(filtros.rol){
            endpoint+=`&rol=${filtros.rol}`
        }
        if(filtros.termino){
            endpoint+=`&termino=${filtros.termino}`
        }
    }
    return this.http.get<{usuarios: Usuario[], pagination: Pagination}>(
        `${this.host}${endpoint}`, 
        { headers: this.obtenerCabeceraAutorizacion() 
    })
  }

  listarRoles(){
    const endpoint = 'rol'
    return this.http.get<{rols: Rol[], pagination: Pagination}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  cambiarEstado(id: string){
    const endpoint = `users/${id}`
    return this.http.put(`${this.host}${endpoint}`, '',{ headers: this.obtenerCabeceraAutorizacion() } )
  }

}
