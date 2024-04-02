import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertasModule } from '../alertas/alertas.module';
import { EditorComponent } from './editor/editor.component';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    RouterLink,
    AppRoutingModule,
    FontAwesomeModule,
    AlertasModule
  ]
})
export class PagesModule { }
