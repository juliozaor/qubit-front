import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pager } from '../../compartido/modelos/Pager';
import { Filters } from '../../compartido/modelos/Filters';
import { ItemIGroupService } from '../item-igroup.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { ItemGroupService } from '../item-group.service';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { CreateItemIGroupModalComponent } from '../create-item-igroup-modal/create-item-igroup-modal.component';
import { UpdateItemIGroupModalComponent } from '../update-item-igroup-modal/update-item-igroup-modal.component';
import { ItemIGroupModel } from '../../models/itemIGroup.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-igroup',
  templateUrl: './item-igroup.component.html',
  styleUrl: './item-igroup.component.css'
})
export class ItemIGroupComponent {
  @ViewChild('modalCreateItem') modalCreateItem!: CreateItemIGroupModalComponent;
  @ViewChild('modalUpdateItem') modalUpdateItem!: UpdateItemIGroupModalComponent;
  @ViewChild('popup') popup!: PopupComponent;

  groupId?:number
  pager: Pager<Filters>;
  groupItems: any
  nameGroup?: string = ''
  items?:any[]
  constructor(private routeActive: ActivatedRoute, private service: ItemIGroupService, private serviceGroup: ItemGroupService, private route:Router){
    this.routeActive.params.subscribe(params => {
      this.groupId = params['groupId'];        
    });
    this.pager = new Pager<Filters>(this.getItems);
    this.getGroup();
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }

  

  getItems = (page: number, limit: number, filters?: Filters) => {
    return new Observable<Pagination>((subscribe) => {
      this.service.getgroupItems(this.groupId!, page, limit, filters).subscribe({
        next: (resp) => {          
          this.groupItems = resp.groupIItems;
          this.items = this.groupItems.items          
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateItem.openModal(this.groupId!);
  }

  updateItems(){
    Swal.fire({
      //title: "Actualización",
      text: "Are you sure to update the items?. The items will be updated to their base prices and base tax",
      icon: "info",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update",
      cancelButtonText:"Cancel"
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon:'info',
          allowOutsideClick: false,      
          text: 'Please wait...',
        });
        Swal.showLoading();

        this.service.updategroupItems(this.groupId!)
        .subscribe({
          next: (resp) => {
            Swal.close();
            this.pager.refrescar();
          },
        });

      }
     
      
    });
  }


  getGroup() {
    this.serviceGroup.getgroupItem(this.groupId!).subscribe({
      next: (resp) => {                  
          this.nameGroup = resp.name    
      },
    });
  }

  modalUpdate(name:string, item: ItemIGroupModel) {
    this.modalUpdateItem.openModal(name, item);
  }

  createdIItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('item created successfully.');
  }

  updatedIItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('item updated successfully.');
  }

  deleteItem(id: number) {
    this.service.deleteGroupItem(id).subscribe({
      next: (resp) => {     
        console.log(resp);
                     
        this.pager.refrescar();
        this.popup.abrirPopupExitoso('item delete successfully.');
      },
    });
  }

  back(){
    this.route.navigate(['/dashboard/items-group']);
  }

}
