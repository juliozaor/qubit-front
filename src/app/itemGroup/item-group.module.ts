import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemGroupComponent } from './item-group/item-group.component';
import { CreateItemGroupModalComponent } from './create-item-group-modal/create-item-group-modal.component';
import { UpdateItemGroupModalComponent } from './update-item-group-modal/update-item-group-modal.component';
import { ItemIGroupComponent } from './item-igroup/item-igroup.component';
import { ItemGroupRoutingModule } from './item-group-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../components/components.module';
import { AlertasModule } from '../alertas/alertas.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { UpdateItemIGroupModalComponent } from './update-item-igroup-modal/update-item-igroup-modal.component';
import { CreateItemIGroupModalComponent } from './create-item-igroup-modal/create-item-igroup-modal.component';



@NgModule({
  declarations: [
    ItemGroupComponent,
    CreateItemGroupModalComponent,
    UpdateItemGroupModalComponent,
    ItemIGroupComponent,
    UpdateItemIGroupModalComponent,
    CreateItemIGroupModalComponent
  ],
  imports: [
    CommonModule,
    ItemGroupRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ComponentsModule,    
    AlertasModule,
    NgSelectModule,
    MatIconModule
  ]
})
export class ItemGroupModule { }
