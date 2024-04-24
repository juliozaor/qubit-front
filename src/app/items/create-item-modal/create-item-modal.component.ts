import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModel } from '../../models/item.model';
import { markFormAsDirty } from '../../utilidades/Utilidades';
import { ItemsService } from '../items.service';
import { TypeUnitModel } from '../../models/masters/typeUnit';
import { TypeItemModel } from '../../models/masters/typeItem';
import { MastersService } from '../../services/masters.service';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-create-item-modal',
  templateUrl: './create-item-modal.component.html',
  styleUrl: './create-item-modal.component.css',
})
export class CreateItemModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('createdItem') createdItem: EventEmitter<void>;
  form: FormGroup;
  item?: ItemModel;
  typesUnit: TypeUnitModel[] = [];
  typesItem: TypeItemModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private serviceItem: ItemsService,
    private serviceMaster: MastersService
  ) {
    this.createdItem = new EventEmitter<void>();
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      typeItemId: new FormControl(undefined, [Validators.required]),
      basePrice: new FormControl(undefined, [Validators.required]),
      baseTax: new FormControl(undefined, [Validators.required]),
      typeUnitId: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getTypeItem()
    this.getTypeUnit()
  }

  openModal() {
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  create() {
    if (this.form.invalid) {
      markFormAsDirty(this.form);
      return;
    }
    const controls = this.form.controls;
    this.serviceItem
      .setItem({
        code: controls['code'].value,
        name: controls['name'].value,
        description: controls['description'].value,
        typeItemId: controls['typeItemId'].value,
        basePrice: controls['basePrice'].value,
        baseTax: controls['baseTax'].value,
        typeUnitId: controls['typeUnitId'].value,
      })
      .subscribe({
        next: () => {
           this.createdItem.emit();
           this.clearForm();
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
  
  clearForm(){
    this.form.reset()
    this.form.get('typeItemId')!.setValue("")
    this.form.get('typeUnitId')!.setValue("")
  }

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
