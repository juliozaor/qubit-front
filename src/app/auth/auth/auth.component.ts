import { Component, ViewChild } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IniciarSesionRespuesta } from '../../models/IniciarSesionRespuesta';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';

//SweetAlrt2
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent {
  usuario: UsuarioModel = new UsuarioModel();
  @ViewChild('popup') popup!: PopupComponent

  forma:FormGroup;

constructor(private auth: AuthService, private router: Router){
  this.forma = new FormGroup({
    'usuario': new FormControl('' , [Validators.required]),
    'password': new FormControl('' , [Validators.required])
  })

  /* this.forma.setValue(this.usuario); */
}


login() {  

  if (this.forma.invalid) {
    this.markFormAsDirty()
    return;
  }

  Swal.fire({
    icon:'info',
    allowOutsideClick: false,      
    text: 'Espere por favor...',
  });
  Swal.showLoading();

  this.usuario.usuario= this.forma.controls['usuario'].value.toString();
  this.usuario.password =this.forma.controls['password'].value;

  this.auth.login(this.usuario).subscribe(

    {
      next: (respuesta: IniciarSesionRespuesta) => {
        localStorage.setItem('rol', respuesta.rol.id);
      localStorage.setItem('nombre', respuesta.usuario.nombre);
      localStorage.setItem('modulos', JSON.stringify(respuesta.rol.modules));
      this.router.navigateByUrl('/dashboard');

      Swal.close();

      },

      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {          
          this.popup.abrirPopupFallido('Error al iniciar sesión', error.error.message)
        }
        if (error.status == 500) {          
          this.popup.abrirPopupFallido('Error al iniciar sesión', error.error.message)
        }
        Swal.close();
      }
    }



    /* (resp: any) => {
      localStorage.setItem('rol', resp.rol.id);
      localStorage.setItem('nombre', resp.usuario.nombre);
      localStorage.setItem('modulos', JSON.stringify(resp.rol.modulos));
      
      this.router.navigateByUrl('/dashboard');
    },
    (err) => {
      console.log(err);
    } */
  );

/* console.log(this.forma.value);
console.log(this.forma); */


/* this.forma.reset(); */

}

public markFormAsDirty(): void {
  (<any>Object).values(this.forma.controls).forEach((control: FormControl) => {
    control.markAsDirty();
    if (control) {
      control.markAsDirty()
    }
  });
}

/* login(form: NgForm) {  

  console.log(form);
  
  
    this.auth.login(this.usuario).subscribe(
      (resp: any) => {
        localStorage.setItem('rol', resp.rol.id);
        localStorage.setItem('nombre', resp.usuario.nombre);
        localStorage.setItem('modulos', JSON.stringify(resp.rol.modulos));
        
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        console.log(err);
      }
    );
  
  
  } */


}
