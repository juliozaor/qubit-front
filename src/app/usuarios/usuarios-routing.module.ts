import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaginaCrearUsuarioComponent } from './paginas/pagina-crear-usuario/pagina-crear-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaCrearUsuarioComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
