import { Component, ViewChild } from '@angular/core';
import { ModalActualizarUsuarioComponent } from '../../componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { Pager } from '../../../compartido/modelos/Pager';
import { FiltrosUsuarios } from '../../modelos/FiltrosUsuarios';
import { Usuario } from '../../modelos/Usuario';
import { Rol } from '../../modelos/Rol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../../compartido/modelos/Pagination';
import { markFormAsDirty } from '../../../utilidades/Utilidades';

@Component({
  selector: 'app-pagina-crear-usuario',
  templateUrl: './pagina-crear-usuario.component.html',
  styleUrl: './pagina-crear-usuario.component.css'
})
export class PaginaCrearUsuarioComponent {
  @ViewChild('modalActualizarUsuario') modalActualizarUsuario!: ModalActualizarUsuarioComponent
  @ViewChild('popup') popup!: PopupComponent
  pager: Pager<FiltrosUsuarios>
  usuarios: Usuario[] = []
  termino: string = ""
  rol: string = ""
  roles: Rol[] = []
  formulario: FormGroup

  constructor(private servicio:UsuariosService){
    this.pager = new Pager<FiltrosUsuarios>(this.obtenerUsuarios)
    this.formulario = new FormGroup({
      name: new FormControl(undefined, [ Validators.required ]),
      lastname: new FormControl(undefined),
      document: new FormControl(undefined, [ Validators.required ]),
      dateBirth: new FormControl(undefined, [ Validators.required ]),
      mail: new FormControl(undefined, [ Validators.required, Validators.email ]),
      phone: new FormControl(undefined),
      roleId: new FormControl("", [ Validators.required ]),
      user: new FormControl("", [ Validators.required ]),
    
    })
  }

  ngOnInit(): void {
    this.pager.begin(1, 5)
    this.obtenerRoles()
  }

  obtenerUsuarios = (pagina: number, limite: number, filtros?: FiltrosUsuarios)=>{
    return new Observable<Pagination>( subscripcion => {
      this.servicio.listar(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.usuarios = respuesta.usuarios
          subscripcion.next(respuesta.pagination) 
        }
      })
    })
  }

  manejarUsuarioActualizado(){
    this.pager.refrescar()
    this.popup.abrirPopupExitoso('Usuario actualizado con éxito.')
  }

  crear(){
    if(this.formulario.invalid){
      markFormAsDirty(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicio.guardar({
      lastname: controls['lastname'].value,
      name: controls['name'].value,
      mail: controls['mail'].value,
      dateBirth: controls['dateBirth'].value,
      document: controls['document'].value,
      roleId: controls['roleId'].value,
      phone: controls['phone'].value,
      user: controls['user'].value
    }).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Usuario creado con éxito.")
        this.pager.refrescar()
        this.limpiarFormulario()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al crear el usuario", "Intentalo más tarde.")
      }
    })
  }
  

  actualizarFiltros(){
    this.pager.filter({
      termino: this.termino,
      rol: this.rol
    })
  }

  limpiarFiltros(){
    this.termino = ""
    this.rol = ""
    this.pager.filter({})
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  abrirModalActualizarUsuario(usuario: Usuario){
    this.modalActualizarUsuario.abrir(usuario)
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {        
        this.roles = respuesta.rols
      }
    })
  }

  cambiarEstado(id:string){
    this.servicio.cambiarEstado(id).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        
      }
    })
  }

  refrescar(){
    this.pager.refrescar()
  }
}
