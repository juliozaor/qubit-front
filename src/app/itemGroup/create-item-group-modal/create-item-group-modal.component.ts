import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemGroupModel } from '../../models/itemGroup.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemGroupService } from '../item-group.service';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-create-item-group-modal',
  templateUrl: './create-item-group-modal.component.html',
  styleUrl: './create-item-group-modal.component.css'
})
export class CreateItemGroupModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('createdItem') createdItem: EventEmitter<void>;
  formulario: FormGroup;
  item?: ItemGroupModel;
  constructor(
    private serviceModal: NgbModal,
    private serviceItem: ItemGroupService,
  ) {
    this.createdItem = new EventEmitter<void>();
    this.formulario = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  openModal() {
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  create() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.serviceItem
      .setItem({
        code: controls['code'].value,
        name: controls['name'].value,
      })
      .subscribe({
        next: () => {
           this.createdItem.emit();
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
}
