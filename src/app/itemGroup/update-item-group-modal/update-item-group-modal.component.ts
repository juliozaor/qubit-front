import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemGroupModel } from '../../models/itemGroup.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemGroupService } from '../item-group.service';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-update-item-group-modal',
  templateUrl: './update-item-group-modal.component.html',
  styleUrl: './update-item-group-modal.component.css'
})
export class UpdateItemGroupModalComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('updatedItem') updatedItem: EventEmitter<void>;
  formulario: FormGroup;
  item?: ItemGroupModel;
  constructor(
    private serviceModal: NgbModal,
    private serviceItem: ItemGroupService
  ) {
    this.updatedItem = new EventEmitter<void>();
    this.formulario = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  openModal(item:ItemGroupModel) {
    this.item = item
    this.fillForm(item);    
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(item:ItemGroupModel){
    const controls = this.formulario.controls
    controls['code'].setValue(item.code)
    controls['name'].setValue(item.name)
  }

  update() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.serviceItem
      .updateItem({
        id: this.item?.id,
        code: controls['code'].value,
        name: controls['name'].value,
      })
      .subscribe({
        next: () => {
           this.updatedItem.emit();
           this.closeModal()
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating group item", "Try again later.")
        },
      });
  }
 

  closeModal() {
    this.serviceModal.dismissAll();
  }

  clearForm(){
    this.formulario.reset()
    this.formulario.get('typeItemId')!.setValue("")
    this.formulario.get('typeUnitId')!.setValue("")
  }
}
