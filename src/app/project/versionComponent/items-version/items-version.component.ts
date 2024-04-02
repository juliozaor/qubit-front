import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CreateItemsVersionModalComponent } from '../create-items-version-modal/create-items-version-modal.component';
import { UpdateItemsVersionModalComponent } from '../update-items-version-modal/update-items-version-modal.component';
import { Pager } from '../../../compartido/modelos/Pager';
import { Filters } from '../../../compartido/modelos/Filters';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';

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
  @ViewChild('modalCreateItemVersion') modalCreateItemVersion!: CreateItemsVersionModalComponent;
  @ViewChild('modalUpdateItemVersion') modalUpdateItemVersion!: UpdateItemsVersionModalComponent;
  
  constructor(){
    //this.pager = new Pager<Filters>(this.itemsGroup);
    this.createdIItemVersionModal = new EventEmitter<void>();
  }


  modalCreate() {
      this.modalCreateItemVersion.openModal(this.itemsGroup.id, this.projectVersionId);
  }

  modalUpdate(item: any) {
    this.modalUpdateItemVersion.openModal(item, this.itemsGroup.id, this.projectVersionId);
  }


  deleteItem(id: number) {
  /*   this.service.deleteGroupItem(id).subscribe({
      next: (resp) => {     
        console.log(resp);
                     
        this.pager.refrescar();
        this.popup.abrirPopupExitoso('item delete successfully.');
      },
    }); */
  }

  createdIItemVersion() {
   // this.pager.refrescar();
   this.createdIItemVersionModal.emit();
    this.popup.abrirPopupExitoso('item created successfully.');
  }

  updatedIItemVersion() {
   this.createdIItemVersionModal.emit();
   //this.pager.refrescar();
    this.popup.abrirPopupExitoso('item updated successfully.');
  }


  toogleUnfolded(){
    this.unfolded = !this.unfolded
  }
}
