import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-calc-estimate',
  templateUrl: './calc-estimate.component.html',
  styleUrl: './calc-estimate.component.css'
})
export class CalcEstimateComponent {
  @ViewChild('popup') popup!: PopupComponent;
 
  groupsItems?: any[];
 
  constructor(
    private service: ReportsService
  ) {
  }


    ngOnInit(): void {
   // this.pager.begin(1, 5);
   this.getGroupItems();
  }

  getGroupItems() {
    this.service
        .getgroupsItems()
        .subscribe({
          next: (resp) => {
            this.groupsItems = resp.groupItems;  
            console.log(this.groupsItems );
                     
      },
    });
  }


 
}
