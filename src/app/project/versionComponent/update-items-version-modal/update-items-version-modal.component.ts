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
      cost: new FormControl(undefined, [Validators.required]),
      costTotal: new FormControl(undefined, [Validators.required]),
      margin: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnInit() {
    this.formulario.get('priceTotal')!.disable();
    this.formulario.get('numberUnit')!.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
      this.calculateCost();
    });
    this.formulario.get('priceUnit')!.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
      this.calculateMargin(1);
    });
    this.formulario.get('tax')!.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    this.formulario.get('cost')!.valueChanges.subscribe(() => {
      this.calculateCost();
      this.calculateMargin(1);
    });
  }

  calculateCost() {
    const cost = parseFloat(this.formulario.get('cost')!.value);
    const nUnit = parseFloat(this.formulario.get('numberUnit')!.value);
    const costTotal = (cost * nUnit);
    this.formulario.get('costTotal')!.setValue(costTotal);
  }

  calculateMargin(c:number) {
    const priceUnit = parseFloat(this.formulario.get('priceUnit')!.value);
    const cost = parseFloat(this.formulario.get('cost')!.value);
    const margin = parseFloat(this.formulario.get('margin')!.value);

    if(c == 1){
    const margin = (((priceUnit-cost) / cost) * 100).toFixed(2);
    this.formulario.get('margin')!.setValue(margin)

    }else if(c == 2){
      const pUnit = cost+ (cost * margin / 100);
      this.formulario.get('priceUnit')!.setValue(pUnit)
    }
  }

  calculateTotalPrice() {
    const pUnit = parseFloat(this.formulario.get('priceUnit')!.value);
    const nUnit = parseFloat(this.formulario.get('numberUnit')!.value);
    const taxU = parseFloat(this.formulario.get('tax')!.value);

    const pTotal = (pUnit * nUnit) + taxU;
    this.formulario.get('priceTotal')!.setValue(pTotal);
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
    controls['cost'].setValue(item.tax);
    controls['costTotal'].setValue(item.tax);
    controls['margin'].setValue(item.tax);

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
        cost: controls['cost'].value,
        costTotal: controls['costTotal'].value,
        margin: controls['margin'].value,
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
