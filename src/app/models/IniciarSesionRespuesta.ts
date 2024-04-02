import { Rol } from "./Rol"

export interface IniciarSesionRespuesta {
  usuario: Usuario
  token: string
  claveTemporal: boolean
  rol: Rol
}

export interface Usuario {
  id: string
  usuario: string
  nombre: string
  apellido:string
  telefono: string
  correo: string
}
