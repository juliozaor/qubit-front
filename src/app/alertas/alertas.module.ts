import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './componentes/popup/popup.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ValidacionComponent } from './componentes/validacion/validacion.component';



@NgModule({
  declarations: [
    PopupComponent,
    ValidacionComponent
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  exports:[
    PopupComponent,
    ValidacionComponent
  ]
})
export class AlertasModule { }
