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


  onItemIdChange() {
    if (this.newItems.itemId) {
      const itemSelect = this.items?.find(item => item.id === this.newItems.itemId);
      this.newItems.priceUnit = itemSelect?.basePrice;
      this.newItems.tax = itemSelect?.baseTax;
      this.newItems.cost = itemSelect?.cost; 
      if (this.newItems.priceUnit && this.newItems.numberUnit && this.newItems.tax == undefined) {
        return console.log("Error al calcular el precio total, parametros indefinidos");
      }
      this.newItems.priceTotal = this.calculateTotalPrice(this.newItems.priceUnit, this.newItems.numberUnit, this.newItems.tax)
      if (this.newItems.cost == undefined) {
        return console.log("Error al calcular el costo total, parametros indefinidos");
      }
      this.newItems.costTotal = this.calculateCost(this.newItems.numberUnit, this.newItems.cost);
      this.newItems.margin = this.calculateMargin(1,this.newItems.priceUnit, this.newItems.cost);
    } else {
      this.newItems = {};
    }
  }



  create() {
    this.newItems.itemGroupId = this.itemsGroup.itemsGroup.id;
    this.newItems.projectVersionId = this.projectVersionId;
    if (this.newItems.priceUnit && this.newItems.numberUnit && this.newItems.tax == undefined) {
      return console.log("Error al calcular el precio total, parametros indefinidos");
    }
    this.newItems.priceTotal = this.calculateTotalPrice(this.newItems.priceUnit, this.newItems.numberUnit, this.newItems.tax)
    if (this.newItems.cost == undefined) {
      return console.log("Error al calcular el costo total, parametros indefinidos");
    }
    if (!this.newItems.costTotal) {
      this.newItems.costTotal = this.calculateCost(this.newItems.numberUnit, this.newItems.cost);    
    }
    if (!this.newItems.margin) {
      this.newItems.margin = this.calculateMargin(1,this.newItems.priceUnit, this.newItems.cost);
    }
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
    const { priceUnit, numberUnit, tax, cost } = ItemIGroupVersion;
    
    if (priceUnit && numberUnit && tax == undefined) {
      console.log("Error al calcular el precio total, parametros indefinidos");
      return;
    }
    ItemIGroupVersion.priceTotal = this.calculateTotalPrice(priceUnit!, numberUnit!, tax!)
    
    if (cost == undefined) {
      console.log("Error al calcular el costo total, parametros indefinidos");
      return;
    }
    ItemIGroupVersion.costTotal = this.calculateCost(numberUnit!, cost);
    ItemIGroupVersion.margin = this.calculateMargin(1,priceUnit!, cost);
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
    Object.assign(items, items.originalValues);
    items.editing = false
  }

  editItem(items: ItemModel) {
    items.originalValues = {...items}
    items.editing = true    
  }

  calculateCost(nUnit: number, cost: number) {
    return (cost * nUnit);
  }

  calculateMargin(c:number, priceUnit: number, cost: number, margin?: number) {
    if(c == 1){
     return margin = parseFloat((((priceUnit-cost) / cost) * 100).toFixed(2));
    }else if(c == 2 && margin != undefined){
      return priceUnit = cost+ (cost * margin / 100);
    }
    return c;
  }

  calculateTotalPrice(pUnit: number, nUnit: number, taxU: number) {
    return (pUnit * nUnit) + taxU;
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
