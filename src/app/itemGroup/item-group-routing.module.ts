import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ItemGroupComponent } from './item-group/item-group.component';
import { ItemIGroupComponent } from './item-igroup/item-igroup.component';

const routes: Routes = [
  {
    path: '',
    component: ItemGroupComponent
  },{
    path: 'items/:groupId',
    component: ItemIGroupComponent
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
export class ItemGroupRoutingModule { }
