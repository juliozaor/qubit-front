import { Component, ViewChild } from '@angular/core';
import { Pager } from '../../compartido/modelos/Pager';
import { Filters } from '../../compartido/modelos/Filters';
import { ItemGroupModel } from '../../models/itemGroup.model';
import { ItemGroupService } from '../item-group.service';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { CreateItemGroupModalComponent } from '../create-item-group-modal/create-item-group-modal.component';
import { UpdateItemGroupModalComponent } from '../update-item-group-modal/update-item-group-modal.component';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ItemIGroupService } from '../item-igroup.service';

@Component({
  selector: 'app-item-group',
  templateUrl: './item-group.component.html',
  styleUrl: './item-group.component.css'
})
export class ItemGroupComponent {

  @ViewChild('modalCreateItem') modalCreateItem!: CreateItemGroupModalComponent;
  @ViewChild('modalUpdateItem') modalUpdateItem!: UpdateItemGroupModalComponent;
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  items: ItemGroupModel[] = [];
  term: string = '';
  constructor(private service: ItemGroupService,private serviceIItem: ItemIGroupService, private route: Router) {
    this.pager = new Pager<Filters>(this.getItems);
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }

  getItems = (page: number, limit: number, filters?: Filters) => {
    return new Observable<Pagination>((subscribe) => {
      this.service.getgroupItems(page, limit, filters).subscribe({
        next: (resp) => {
          this.items = resp.groupItems;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateItem.openModal();
  }

  modalUpdate(item: ItemGroupModel) {
    this.modalUpdateItem.openModal(item);
  }
  
  openItems(groupId: number) {
    if (groupId) {
      this.route.navigate(['/dashboard/items-group/items', groupId]);
    }
  }

  deleteItem(id?: number) {
    console.log(id);
  }

  updateFilters() {
    this.pager.filter({
      term: this.term,
    });
  }

  clearFilters() {
    this.term = '';
    this.pager.filter({});
  }

  createdItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Group item created successfully.');
  }
  updatedItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Group item updated successfully.');
  }

  cloneGroup(id:number){
    Swal.fire({
      //title: "Actualización",
      text: "Are you sure you want to clone the group?",
      icon: "info",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Clone",
      cancelButtonText:"Cancel"
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon:'info',
          allowOutsideClick: false,      
          text: 'Please wait...',
        });
        Swal.showLoading();

        this.service.clonegroupItem(id)
        .subscribe({
          next: (resp) => {
            console.log(resp.id);
            Swal.close();
            if(resp.id){
            this.cloneGroupIItem(id, resp.id)
            }
            this.pager.refrescar();
          },
        });

      }
     
      
    });
  }

  cloneGroupIItem(idOld:number, idNew:number){
    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Please wait...',
    });
    Swal.showLoading();

    this.serviceIItem.cloneGroupIItem(idOld, idNew)
    .subscribe({
      next: (resp) => {
        Swal.close();       
        this.popup.abrirPopupExitoso('Cloning completed successfully')
        this.pager.refrescar();
      },
    });
  }
 
}
