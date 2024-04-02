import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaCrearUsuarioComponent } from './paginas/pagina-crear-usuario/pagina-crear-usuario.component';
import { ModalActualizarUsuarioComponent } from './componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { AlertasModule } from '../alertas/alertas.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputBusquedaComponent } from './componentes/input-busqueda/input-busqueda.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    PaginaCrearUsuarioComponent,
    ModalActualizarUsuarioComponent,
    InputBusquedaComponent,    
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    AlertasModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatIconModule
  ]
})
export class UsuariosModule { }
