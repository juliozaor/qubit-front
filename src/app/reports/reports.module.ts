import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalcEstimateComponent } from './calc-estimate/calc-estimate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { ReportsRoutingModule } from './reports-routing.module';



@NgModule({
  declarations: [
    CalcEstimateComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    AlertasModule,
    NgSelectModule,
    MatIconModule
  ]
})
export class ReportsModule { }
