import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcepDrawComponent } from './concep-draw/concep-draw.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConcepDrawComponent
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
export class ConcepDrawRoutingModule { }
