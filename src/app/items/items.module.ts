import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from './items/items.component';
import { ItemsRoutingModule } from './items-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { CreateItemModalComponent } from './create-item-modal/create-item-modal.component';
import { UpdateItemModalComponent } from './update-item-modal/update-item-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { AlertasModule } from '../alertas/alertas.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    ItemsComponent,
    CreateItemModalComponent,
    UpdateItemModalComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ComponentsModule,    
    AlertasModule,
    NgSelectModule,
    MatIconModule
  ]
})
export class ItemsModule { }
