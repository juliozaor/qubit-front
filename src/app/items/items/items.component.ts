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
  term: string = '';
  constructor(private service: ItemsService) {
    this.pager = new Pager<Filters>(this.getItems);
  }

  ngOnInit(): void {
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
