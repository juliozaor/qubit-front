import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemIGroupVersionModel } from '../../../models/itemIGroupVersion.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';

@Component({
  selector: 'app-update-items-version-modal',
  templateUrl: './update-items-version-modal.component.html',
  styleUrl: './update-items-version-modal.component.css'
})
export class UpdateItemsVersionModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('updatedIItemVersion') updatedIItemVersion: EventEmitter<void>;
  formulario: FormGroup;
  item?: any;
  name: string = '';
  groupId?:number;
  projectVersionId?: number;
  constructor(
    private serviceModal: NgbModal,
    private serviceItem: ItemIGroupVersionItemService
  ) {
    this.updatedIItemVersion = new EventEmitter<void>();
    this.formulario = new FormGroup({
      name: new FormControl('', [Validators.required]),
      numberUnit: new FormControl(undefined, [Validators.required]),
      priceUnit: new FormControl(undefined, [Validators.required]),
      priceTotal: new FormControl(undefined, [Validators.required]),
      tax: new FormControl(undefined, [Validators.required]),
    });
  }

  openModal(item: any, groupId:number, projectVersionId:number) {
    this.projectVersionId = projectVersionId
    
    this.item = item;    
    this.name = item.name;
    this.fillForm(item);
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(item: ItemIGroupVersionModel) {
    const controls = this.formulario.controls;
    controls['name'].setValue(this.name);
    controls['name'].disable();
    controls['numberUnit'].setValue(item.numberUnit);
    controls['priceUnit'].setValue(item.priceUnit);
    controls['priceTotal'].setValue(item.priceTotal);
    controls['tax'].setValue(item.tax);
  }

  update() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.serviceItem
      .updateItemIGroup({
        id: this.item?.id,
        priceUnit: controls['priceUnit'].value,
        numberUnit: controls['numberUnit'].value,
        priceTotal: controls['priceTotal'].value,
        tax: controls['tax'].value,
      })
      .subscribe({
        next: () => {
          this.updatedIItemVersion.emit();
          this.closeModal();
        },
        error: () => {
          this.popup.abrirPopupFallido(
            'Error updating item',
            'Try again later.'
          );
        },
      });
  }

  closeModal() {
    this.serviceModal.dismissAll();
  }

  clearForm() {
    this.formulario.reset();
  }
}
