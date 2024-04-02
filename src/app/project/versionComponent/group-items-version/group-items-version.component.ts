import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { ActivatedRoute } from '@angular/router';
import { Pager } from '../../../compartido/modelos/Pager';
import { Filters } from '../../../compartido/modelos/Filters';
import { ItemGroupService } from '../../../itemGroup/item-group.service';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { Pagination } from '../../../compartido/modelos/Pagination';
import { Observable } from 'rxjs';
import { ItemsVersionComponent } from '../items-version/items-version.component';

@Component({
  selector: 'app-group-items-version',
  templateUrl: './group-items-version.component.html',
  styleUrl: './group-items-version.component.css',
})
export class GroupItemsVersionComponent {
  /* @ViewChild('modalCreateItem') modalCreateItem!: CreateItemIGroupModalComponent;
  @ViewChild('modalUpdateItem') modalUpdateItem!: UpdateItemIGroupModalComponent; */
  @ViewChild('popup') popup!: PopupComponent;

  projectVersionId?: number;
  // pager: Pager<Filters>;
  //groupItems: any
  nameGroup?: string = '';
  groupIItemVersions?: any;
  groupItems?: any[];
  formulario: FormGroup;
  @ViewChildren('itemsVersion') itemsVersion!: QueryList<ItemsVersionComponent>
  constructor(
    private routeActive: ActivatedRoute,
    private service: ItemIGroupVersionItemService,
    private serviceGroup: ItemGroupService
  ) {
    this.routeActive.params.subscribe((params) => {
      this.projectVersionId = params['projectVersionId'];
    });
    this.getGroups();
    
    this.formulario = new FormGroup({
      groupId: new FormControl(undefined, [Validators.required]),
    });
   // this.pager = new Pager<Filters>(this.getGroupItems);
  }

  addGroup() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;

    this.service
    .addGroupIItem(this.projectVersionId!, controls['groupId'].value )
    .subscribe({
      next: () => {
       // this.pager.refrescar();
      },
      error: () => {
         this.popup.abrirPopupFallido("Error updating group item", "Try again later.")
      },
    });

    

  }

    ngOnInit(): void {
   // this.pager.begin(1, 5);
   this.getGroupItems();
  }

  getGroupItems() {
    this.service
        .getVersionByGroups(this.projectVersionId!)
        .subscribe({
          next: (resp) => {
            this.groupIItemVersions = resp.groupIItemVersions;            
      },
    });
  }

  /*   modalCreate() {
    this.modalCreateItem.openModal(this.groupId!);
  }
 */

  getGroups() {
    this.serviceGroup.getgroupItems(1, 100000).subscribe({
      next: (resp) => {
        this.groupItems = resp.groupItems;
      },
    });
  }

  createdIItemVersion() {
    // this.pager.refrescar();
     this.popup.abrirPopupExitoso('item created successfully.');
   }

  /*   modalUpdate(name:string, item: ItemIGroupModel) {
    this.modalUpdateItem.openModal(name, item);
  } */

  /*   createdIItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('item created successfully.');
  } */

  /*   updatedIItem() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('item updated successfully.');
  } */

  /*   deleteItem(id: number) {
    this.service.deleteGroupItem(id).subscribe({
      next: (resp) => {     
        console.log(resp);
                     
        this.pager.refrescar();
        this.popup.abrirPopupExitoso('item delete successfully.');
      },
    });
  } */

}
