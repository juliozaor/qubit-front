import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemIGroupModel } from '../../models/itemIGroup.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemIGroupService } from '../item-igroup.service';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-update-item-igroup-modal',
  templateUrl: './update-item-igroup-modal.component.html',
  styleUrl: './update-item-igroup-modal.component.css',
})
export class UpdateItemIGroupModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('updatedIItem') updatedIItem: EventEmitter<void>;
  formulario: FormGroup;
  item?: ItemIGroupModel;
  name: string = '';
  constructor(
    private serviceModal: NgbModal,
    private serviceItem: ItemIGroupService
  ) {
    this.updatedIItem = new EventEmitter<void>();
    this.formulario = new FormGroup({
      name: new FormControl('', [Validators.required]),
      numberUnit: new FormControl(undefined, [Validators.required]),
      priceUnit: new FormControl(undefined, [Validators.required]),
      priceTotal: new FormControl(undefined, [Validators.required]),
      tax: new FormControl(undefined, [Validators.required]),
    });
  }

  openModal(name: string, item: ItemIGroupModel) {
    this.item = item;    
    this.name = name;
    this.fillForm(item);
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  ngOnInit() {
    this.formulario.get('priceTotal')!.disable();
    this.formulario.get('numberUnit')!.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
    this.formulario.get('priceUnit')!.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
    this.formulario.get('tax')!.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    const pUnit = parseFloat(this.formulario.get('priceUnit')!.value);
    const nUnit = parseFloat(this.formulario.get('numberUnit')!.value);
    const taxU = parseFloat(this.formulario.get('tax')!.value);

    const pTotal = (pUnit * nUnit) + taxU;

    this.formulario.get('priceTotal')!.setValue(pTotal);
  }


  fillForm(item: ItemIGroupModel) {
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
      .updateItem({
        id: this.item?.id,
        priceUnit: controls['priceUnit'].value,
        numberUnit: controls['numberUnit'].value,
        priceTotal: controls['priceTotal'].value,
        tax: controls['tax'].value,
      })
      .subscribe({
        next: () => {
          this.updatedIItem.emit();
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
