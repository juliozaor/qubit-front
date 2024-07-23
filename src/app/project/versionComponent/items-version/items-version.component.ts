import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CreateItemsVersionModalComponent } from '../create-items-version-modal/create-items-version-modal.component';
import { UpdateItemsVersionModalComponent } from '../update-items-version-modal/update-items-version-modal.component';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemModel } from '../../../models/item.model';
import { ItemsService } from '../../../items/items.service';
import { ItemIGroupVersionModel } from '../../../models/itemIGroupVersion.model';

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

  formulario: FormGroup;
  items?: ItemModel[]
  showBlankRow: boolean = false;
  newItems: any = {};

  constructor(
    private service: ItemIGroupVersionItemService,
    private serviceItem: ItemsService,
  ){
    this.deleteGroupEmit = new EventEmitter<void>();
    this.createdIItemVersionModal = new EventEmitter<void>();
    this.updateIItemVersionModal = new EventEmitter<void>();
    this.deleteIItemVersionModal = new EventEmitter<void>();
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

    // console.log(this.itemsGroup.itemsGroup.items);

  }


  create() {
    this.newItems.itemGroupId = this.itemsGroup.itemsGroup.id;
    this.newItems.projectVersionId = this.projectVersionId;
    this.service.setItemIGroup(this.newItems)
      .subscribe({
        next: () => {
          this.createdIItemVersion();
          this.showBlankRow = false;
          this.newItems = {};
        },
        error: () => {
          this.popup.abrirPopupFallido(
            'Error updating Project',
            'Try again later.'
          );
        },
      });
  }

  update(ItemIGroupVersion: ItemIGroupVersionModel) {    
    this.service
      .updateItemIGroup(ItemIGroupVersion)
      .subscribe({
        next: () => {           
          this.updatedIItemVersion()
          ItemIGroupVersion.editing = false;
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating project", "Try again later.")
        },
      });
  }

  showNew(){
    this.newItems = {};
    this.showBlankRow = true;
  }

  closeCreate() {
    this.showBlankRow = false;
    this.newItems = {};
  }

  closeUpdate(items: ItemModel) {
    items.editing = false
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

  modalCreate() {
      this.modalCreateItemVersion.openModal(this.itemsGroup.itemsGroup.id, this.projectVersionId);
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

        this.service.updateVersionByGroups(this.itemsGroup.itemsGroup.id, this.projectVersionId)
        .subscribe({
          next: (resp) => {
            Swal.close();
            this.updateIItemVersionModal.emit();
          },
        });

      }


    });
  }

  getItems(){
    this.serviceItem.getItems(1,10000).subscribe({
      next: (resp) => {
        this.items = resp.items
      }
    })
  }

  modalUpdate(item: any) {
    this.modalUpdateItemVersion.openModal(item, this.itemsGroup.itemsGroup.id, this.projectVersionId);
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
