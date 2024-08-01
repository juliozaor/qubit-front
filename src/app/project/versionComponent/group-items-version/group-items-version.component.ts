import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Pager } from '../../../compartido/modelos/Pager';
import { Filters } from '../../../compartido/modelos/Filters';
import { ItemGroupService } from '../../../itemGroup/item-group.service';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { Pagination } from '../../../compartido/modelos/Pagination';
import { Observable } from 'rxjs';
import { ItemsVersionComponent } from '../items-version/items-version.component';
import { ProjectVersionService } from '../../project-version.service';
import { MastersService } from '../../../services/masters.service';

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
  version?:string;
  projectId?:number;
  name?:string;
  location?:number;
  @ViewChildren('itemsVersion') itemsVersion!: QueryList<ItemsVersionComponent>
  constructor(
    private routeActive: ActivatedRoute,
    private serviceVersion: ProjectVersionService, 
    private service: ItemIGroupVersionItemService,
    private serviceMaster: MastersService, private route:Router
  ) {
    this.routeActive.params.subscribe((params) => {
      this.projectVersionId = params['projectVersionId'];
      this.location = params['location'];
    });
    this.getCategories();
    this.getProjectVersion();
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
      next: (resp) => {
       // this.pager.refrescar();
        this.getGroupItems()        
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

  deleteGroupEmit(){    
    this.getGroupItems()
  }

  createdIItemVersionModal(){
    this.getGroupItems()
    this.popup.abrirPopupExitoso('item created successfully.');
  }

  updateIItemVersionModal(){
    
    this.getGroupItems()
    this.popup.abrirPopupExitoso('item updated successfully.');
  }

  deleteIItemVersionModal(){    
    this.getGroupItems()
    this.popup.abrirPopupExitoso('item delete successfully.');
  }

  getCategories() {
    this.serviceMaster.getCategories().subscribe({
      next: (resp) => {
        this.groupItems = resp.categories;
      },
    });
  }

  getProjectVersion() {
    this.serviceVersion.getProjectVersion(this.projectVersionId!).subscribe({
      next: (resp) => {
        
        this.version = resp.version
        this.projectId =resp.project_id
        this.name = resp.project.name

        
      },
    });
  }

  back(){
    if(this.location == 2){
      this.route.navigate(['/dashboard/project/calEstimate', this.projectVersionId]);
    }else{
      this.route.navigate([`/dashboard/project/versions/${ this.projectId }/${ this.name }`]);
    }
  }


}
