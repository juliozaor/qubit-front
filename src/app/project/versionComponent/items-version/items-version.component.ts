import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CreateItemsVersionModalComponent } from '../create-items-version-modal/create-items-version-modal.component';
import { UpdateItemsVersionModalComponent } from '../update-items-version-modal/update-items-version-modal.component';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-items-version',
  templateUrl: './items-version.component.html',
  styleUrl: './items-version.component.css'
})
export class ItemsVersionComponent {
 // pager: Pager<Filters>;
  @ViewChild('popup') popup!: PopupComponent
  unfolded: boolean = false
  @Input() itemsGroup!: any
  @Input() projectVersionId!: number
  @Output('createdIItemVersionModal') createdIItemVersionModal: EventEmitter<void>;
  @Output('updateIItemVersionModal') updateIItemVersionModal: EventEmitter<void>;
  @Output('deleteIItemVersionModal') deleteIItemVersionModal: EventEmitter<void>;
  @Output('deleteGroupEmit') deleteGroupEmit: EventEmitter<void>;
  @ViewChild('modalCreateItemVersion') modalCreateItemVersion!: CreateItemsVersionModalComponent;
  @ViewChild('modalUpdateItemVersion') modalUpdateItemVersion!: UpdateItemsVersionModalComponent;
  
  constructor(private service: ItemIGroupVersionItemService){    
    this.deleteGroupEmit = new EventEmitter<void>();
    this.createdIItemVersionModal = new EventEmitter<void>();
    this.updateIItemVersionModal = new EventEmitter<void>();
    this.deleteIItemVersionModal = new EventEmitter<void>();
  }


  modalCreate() {
      this.modalCreateItemVersion.openModal(this.itemsGroup.id, this.projectVersionId);
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

        this.service.updateVersionByGroups(this.itemsGroup.id, this.projectVersionId)
        .subscribe({
          next: (resp) => {
            Swal.close();
            this.updateIItemVersionModal.emit();
          },
        });

      }
     
      
    });
  }

  modalUpdate(item: any) {
    this.modalUpdateItemVersion.openModal(item, this.itemsGroup.id, this.projectVersionId);
  }

  deleteGroup(id:number){
   this.service.deleteGroupIItems(id,this.projectVersionId).subscribe({
      next: (resp) => {     
        this.popup.abrirPopupExitoso('Group items delete successfully.');
        this.deleteGroupEmit.emit();
      },
    });
  }


  deleteItem(id: number) {    
    this.service.deleteGroupItem(id).subscribe({
      next: () => {    
        this.deleteIItemVersionModal.emit();
      },
    });
  }

  createdIItemVersion() {
   this.createdIItemVersionModal.emit();
  }

  updatedIItemVersion() {
    this.updateIItemVersionModal.emit();
  }


  toogleUnfolded(){
    this.unfolded = !this.unfolded
  }
}
