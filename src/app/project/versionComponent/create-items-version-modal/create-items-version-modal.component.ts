import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemModel } from '../../../models/item.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from '../../../items/items.service';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';
import { markFormAsDirty } from '../../../utilidades/Utilidades';

@Component({
  selector: 'app-create-items-version-modal',
  templateUrl: './create-items-version-modal.component.html',
  styleUrl: './create-items-version-modal.component.css'
})
export class CreateItemsVersionModalComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('createdIItemVersion') createdIItemVersion: EventEmitter<void>;
  formulario: FormGroup;
  items?: ItemModel[]
  itemGroupId?:number
  projectVersionId?:number
  constructor(
    private serviceModal: NgbModal,
    private serviceItemIGroup: ItemIGroupVersionItemService,
    private serviceItem: ItemsService,
  ) {
    this.createdIItemVersion = new EventEmitter<void>();
    this.formulario = new FormGroup({
      numberUnit: new FormControl(undefined, [Validators.required]),
      priceUnit: new FormControl(undefined, [Validators.required]),
      priceTotal: new FormControl(undefined, [Validators.required]),
      tax: new FormControl(undefined, [Validators.required]),
      itemId: new FormControl(undefined, [Validators.required]),
      cost: new FormControl(undefined, [Validators.required]),
      costTotal: new FormControl(undefined, [Validators.required]),
      margin: new FormControl(undefined, [Validators.required]),
    });
    this.getItems()
    
  }

  openModal(itemGroupId:number, projectVersionId:number) {
    this.formulario.reset()
    this.itemGroupId =itemGroupId    
    this.projectVersionId =projectVersionId
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  ngOnInit() {
    this.formulario.get('itemId')!.valueChanges.subscribe((itemId) => {
      const itemSelect = this.items?.find(item => item.id === itemId);
      if (itemSelect) {
        this.formulario.patchValue({
          priceUnit: itemSelect.basePrice,
          tax: itemSelect.baseTax,
          cost: itemSelect.cost
        });
        this.calculateTotalPrice();
      }
    });

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

  create() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.serviceItemIGroup.setItemIGroup({
        itemId: controls['itemId'].value,
        itemGroupId: this.itemGroupId,
        projectVersionId: this.projectVersionId,
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
           this.createdIItemVersion.emit();
           this.closeModal()
        },
        error: () => {
           this.popup.abrirPopupFallido("Error add item", "Try again later.")
        },
      });
  }


  getItems(){    
    this.serviceItem.getItems(1,10000).subscribe({
      next: (resp) => {
        this.items = resp.items        
      }
    })
  }
  
  closeModal() {
    this.serviceModal.dismissAll();
    console.log('Gv',this.itemGroupId, 'Pv', this.projectVersionId);
  }


    
}
