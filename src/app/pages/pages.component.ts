import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ModuloModel } from '../models/modulo.model';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css',
})
export class PagesComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  modulos: ModuloModel[] = [];

  faTrash = faTrash;

  constructor(
    private observer: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router
  ) {
    this.modulos = this.auth.obtenerModulos();
    
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((resp: any) => {
      if (resp.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    this.cd.detectChanges();
  }

  // ocultar panel lateral
  mostrarBotones: boolean = false;

 /*  toggleBotones() {
    this.mostrarBotones = !this.mostrarBotones;
  } */

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
