import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { Usuario } from '../../modelos/Usuario';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from '../../modelos/Rol';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../servicios/usuarios.service';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-modal-actualizar-usuario',
  templateUrl: './modal-actualizar-usuario.component.html',
  styleUrl: './modal-actualizar-usuario.component.css'
})
export class ModalActualizarUsuarioComponent {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('usuarioActualizado') usuarioActualizado: EventEmitter<void>;
  usuario?: Usuario
  formulario: FormGroup
  roles: Rol[] = []

  constructor(private servicioModal: NgbModal, private servicio: UsuariosService){
    this.usuarioActualizado = new EventEmitter<void>();
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
    this.obtenerRoles()
  }

  abrir(usuario: Usuario){
    this.usuario = usuario
    this.rellenarFormulario(usuario)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  actualizar(){
    if(this.formulario.invalid){
      markFormAsDirty(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicio.actualizar(this.usuario!.user, {
      lastname: controls['lastname'].value,
      name: controls['name'].value,
      mail: controls['mail'].value,
      dateBirth: controls['dateBirth'].value,
      roleId: controls['roleId'].value,
      phone: controls['phone'].value,
      user: controls['user'].value

    }).subscribe({
      next: ()=>{
        this.usuarioActualizado.emit();
        this.cerrar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar el usuario", "Intentalo más tarde.")
      }
    })
  }

  rellenarFormulario(usuario: Usuario){
    const controls = this.formulario.controls
    controls['lastname'].setValue(usuario.lastname)
    controls['name'].setValue(usuario.name)
    controls['mail'].setValue(usuario.mail)
    controls['dateBirth'].setValue(
      DateTime.fromISO(usuario.dateBirth).toFormat('yyyy-MM-dd') 
    )
    controls['document'].setValue(usuario.document)
    controls['document'].disable()
    controls['roleId'].setValue(usuario.roleId)
    controls['phone'].setValue(usuario.phone)
    controls['user'].setValue(usuario.user)
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }
}
