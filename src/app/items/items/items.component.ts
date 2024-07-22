import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { Filters } from '../../compartido/modelos/Filters';
import { Pager } from '../../compartido/modelos/Pager';
import { ItemsService } from '../items.service';
import { ItemModel } from '../../models/item.model';
import { CreateItemModalComponent } from '../create-item-modal/create-item-modal.component';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { UpdateItemModalComponent } from '../update-item-modal/update-item-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MastersService } from '../../services/masters.service';
import { TypeUnitModel } from '../../models/masters/typeUnit';
import { TypeItemModel } from '../../models/masters/typeItem';
import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  @ViewChild('modalCreateItem') modalCreateItem!: CreateItemModalComponent;
  @ViewChild('modalUpdateItem') modalUpdateItem!: UpdateItemModalComponent;
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  items: ItemModel[] = [];
  typesUnit: TypeUnitModel[] = [];
  typesItem: TypeItemModel[] = [];
  categories: CategoryModel[] = [];
  term: string = '';
  showBlankRow: boolean = false;
  newItem: any = {};
  form: FormGroup;
  constructor(private service: ItemsService,
    private serviceMaster: MastersService) {
    this.pager = new Pager<Filters>(this.getItems);
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      typeItemId: new FormControl(undefined, [Validators.required]),
      basePrice: new FormControl(undefined, [Validators.required]),
      baseTax: new FormControl(undefined, [Validators.required]),
      typeUnitId: new FormControl(undefined, [Validators.required]),
      categoryId: new FormControl(undefined, [Validators.required]),
      cost: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getTypeItem()
    this.getTypeUnit()
    this.getCategories()
    this.pager.begin(1, 5);
  }

  getItems = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.service.getItems(page, limit, filters).subscribe({
        next: (resp) => {
          this.items = resp.items;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  showNew(){
    this.newItem = {}; 
    this.showBlankRow = true;
  }

  create() {
    this.service
      .setItem(this.newItem)
      .subscribe({
        next: () => {
           this.createdItem()
           this.showBlankRow = false; 
           this.newItem = {}; 
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating item", "Try again later.")
        },
      });
  }

  update(item:ItemModel) {    
    this.service
      .updateItem(item)
      .subscribe({
        next: () => {           
           this.updatedItem()
           item.editing=false;
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating item", "Try again later.")
        },
      });
  }

  closeCreate() {
    this.showBlankRow = false;
    this.newItem = {};
  }

  closeUpdate(item: ItemModel) {
    item.editing = false
    this.pager.refrescar();
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

  getCategories() {
    this.serviceMaster.getCategories().subscribe({
      next: (resp) => {
        this.categories = resp.categories;    
         
        console.log(this.categories);            
      },
    });
  }

  modalCreate() {
    this.modalCreateItem.openModal();
  }

  modalUpdate(item: ItemModel) {
    this.modalUpdateItem.openModal(item);
  }

  deleteItem(id?: number) {
    console.log(id);
  }

  updateFilters() {
    this.pager.filter({
      term: this.term,
    });
  }

  clearFilters() {
    this.term = '';
    this.pager.filter({});
  }

  createdItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Item created successfully.');
  }
  updatedItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Item updated successfully.');
  }
}
