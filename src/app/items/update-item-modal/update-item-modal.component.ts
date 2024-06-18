import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from '../items.service';
import { MastersService } from '../../services/masters.service';
import { TypeUnitModel } from '../../models/masters/typeUnit';
import { TypeItemModel } from '../../models/masters/typeItem';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemModel } from '../../models/item.model';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-update-item-modal',
  templateUrl: './update-item-modal.component.html',
  styleUrl: './update-item-modal.component.css'
})
export class UpdateItemModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('updatedItem') updatedItem: EventEmitter<void>;
  formulario: FormGroup;
  item?: ItemModel;
  typesUnit: TypeUnitModel[] = [];
  typesItem: TypeItemModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private serviceItem: ItemsService,
    private serviceMaster: MastersService
  ) {
    this.updatedItem = new EventEmitter<void>();
    this.formulario = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      typeItemId: new FormControl(undefined, [Validators.required]),
      basePrice: new FormControl(undefined, [Validators.required]),
      baseTax: new FormControl(undefined, [Validators.required]),
      typeUnitId: new FormControl(undefined, [Validators.required]),
      cost: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getTypeItem()
    this.getTypeUnit()
  }

  openModal(item:ItemModel) {
    this.item = item
    this.fillForm(item);    
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(item:ItemModel){
    const controls = this.formulario.controls
    controls['code'].setValue(item.code)
    controls['name'].setValue(item.name)
    controls['description'].setValue(item.description)
    controls['typeItemId'].setValue(item.typeItemId)
    controls['basePrice'].setValue(item.basePrice)
    controls['baseTax'].setValue(item.baseTax)
    controls['typeUnitId'].setValue(item.typeUnitId)
    controls['cost'].setValue(item.cost)
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
        description: controls['description'].value,
        typeItemId: controls['typeItemId'].value,
        basePrice: controls['basePrice'].value,
        baseTax: controls['baseTax'].value,
        typeUnitId: controls['typeUnitId'].value,
        cost: controls['cost'].value,
      })
      .subscribe({
        next: () => {
           this.updatedItem.emit();
           this.closeModal()
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating item", "Try again later.")
        },
      });
  }

  getTypeUnit() {
    this.serviceMaster.getTypeUnits().subscribe({
      next: (resp) => {
        this.typesUnit = resp.typeUnit;        
      },
    });
  }
  getTypeItem() {
    this.serviceMaster.getTypeItems().subscribe({
      next: (resp) => {
        this.typesItem = resp.typeItem;        
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
