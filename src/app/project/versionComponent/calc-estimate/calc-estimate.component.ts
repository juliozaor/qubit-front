import { Component, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectVersionService } from '../../project-version.service';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';
import { ItemGroupService } from '../../../itemGroup/item-group.service';
import { CreateItemsVersionModalComponent } from '../create-items-version-modal/create-items-version-modal.component';
import { UpdateItemsVersionModalComponent } from '../update-items-version-modal/update-items-version-modal.component';

@Component({
  selector: 'app-calc-estimate',
  templateUrl: './calc-estimate.component.html',
  styleUrl: './calc-estimate.component.css'
})
export class CalcEstimateComponent {
  @ViewChild('popup') popup!: PopupComponent;

  projectVersionId?: number;
  nameGroup?: string = '';
  groupIItemVersions?: any;
  groupItems?: any[];
  version?:string;
  projectId?:number;
  name?:string;

  priceTotalProject: number = 0;
  marginProject: number = 0;
  costTotalProject: number = 0;




  @ViewChild('modalCreateItemVersion') modalCreateItemVersion!: CreateItemsVersionModalComponent;
  @ViewChild('modalUpdateItemVersion') modalUpdateItemVersion!: UpdateItemsVersionModalComponent;
  constructor(
    private routeActive: ActivatedRoute,
    private serviceVersion: ProjectVersionService, 
    private service: ItemIGroupVersionItemService,
    private route:Router
  ) {
    this.routeActive.params.subscribe((params) => {
      this.projectVersionId = params['projectVersionId'];
    });
    this.getProjectVersion();
    
  }

  addGroup() {   
    

  }

    ngOnInit(): void {
   // this.pager.begin(1, 5);
   this.getGroupItems();
  }

  getGroupItems() {
    console.log(this.projectVersionId);
    
    this.service
        .getVersionByGroups(this.projectVersionId!)
        .subscribe({
          next: (resp) => {

            /* this.groupIItemVersions = resp.groupIItemVersions;    */ 
            this.calculate(resp.groupIItemVersions )
                    
      },
    });
  }

  calculate(groupIItemVersions:any){
    this.priceTotalProject = 0
      this.marginProject = 0
      this.costTotalProject = 0

    for (let group of groupIItemVersions) {
      let priceTotalSum = 0;
      let marginSum = 0;
      let costTotalSum = 0;

      // Iterar sobre los elementos del grupo y sumar los valores correspondientes
      for (let item of group.itemsGroup.items) {
          priceTotalSum += item.priceTotal;
          marginSum += item.margin;
          costTotalSum += item.costTotal;
      }

      // Agregar las sumatorias al objeto del grupo actual
      group.priceTotalSum = priceTotalSum;
      group.marginSum = marginSum;
      group.costTotalSum = costTotalSum;

      this.priceTotalProject += group.priceTotalSum 
      this.marginProject += group.marginSum 
      this.costTotalProject += group.costTotalSum 
  }
  
  this.groupIItemVersions = groupIItemVersions;   
  }


  createdIItemVersion(){
    console.log("Creado");
    
    this.getGroupItems()
    this.popup.abrirPopupExitoso('item created successfully.');
  }

  updatedIItemVersion(){
    
    this.getGroupItems()
    this.popup.abrirPopupExitoso('item updated successfully.');
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
    this.route.navigate([`/dashboard/project/versions/${ this.projectId }/${ this.name }`]);
  }


  modalCreate(id: number) {
    this.modalCreateItemVersion.openModal(id, this.projectVersionId!);
  }
  modalUpdate(item: any, groupId:number) {
    this.modalUpdateItemVersion.openModal(item, groupId, this.projectVersionId!);
  }
  deleteItem(id: number) {    
    this.service.deleteGroupItem(id).subscribe({
      next: () => {    
        this.getGroupItems()
        this.popup.abrirPopupExitoso('item delete successfully.');
      },
    });
  }

  openGroups() {
      this.route.navigate(['/dashboard/project/groupItems', this.projectVersionId, 2]);
  }


}
