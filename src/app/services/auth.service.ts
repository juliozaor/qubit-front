import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ModuloModel } from '../models/modulo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBackend:string
  userToken: string = '';
  modulos:ModuloModel[] = [];

  constructor(private http: HttpClient) {
    this.urlBackend = environment.urlBackend
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('modulos');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      usuario: usuario.usuario,
      contrasena: usuario.password,
    };
    const endpoint = 'auth/login';
    return this.http.post(`${this.urlBackend}${endpoint}`, authData).pipe(
      map((resp: any) => {
        this.guardarToken(resp['token']);
        this.guardardatos(resp);
        return resp;
      })
    );
  }

  register() {}

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')!;
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {
    //Validar si el token esta activo o vencido
    /* console.log('Valido estado');
    console.log(this.userToken.length); */
    this.leerToken();
    
    return this.userToken.length > 2;
  }

  private guardardatos(resp: any) {    
    localStorage.setItem('rol', resp.rol.id);
    localStorage.setItem('nombre', resp.usuario.nombre);
    localStorage.setItem('modulos', JSON.stringify(resp.rol.modules));
    console.log();
    
  }

  obtenerModulos() {
    if (localStorage.getItem('modulos')) {
      this.modulos = JSON.parse(localStorage.getItem('modulos')!);      
    } else {
      this.modulos = [];
    }

    return this.modulos;
  }

}
