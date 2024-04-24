import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcepDrawComponent } from './concep-draw/concep-draw.component';
import { UpdateConcepDrawModalComponent } from './update-concep-draw-modal/update-concep-draw-modal.component';
import { CreateConcepDrawModalComponent } from './create-concep-draw-modal/create-concep-draw-modal.component';
import { ConcepDrawRoutingModule } from './concep-draw-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../components/components.module';
import { AlertasModule } from '../alertas/alertas.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    ConcepDrawComponent,
    UpdateConcepDrawModalComponent,
    CreateConcepDrawModalComponent
  ],
  imports: [
    CommonModule,
    ConcepDrawRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ComponentsModule,    
    AlertasModule,
    NgSelectModule,
    MatIconModule
  ]
})
export class ConcepDrawModule { }
