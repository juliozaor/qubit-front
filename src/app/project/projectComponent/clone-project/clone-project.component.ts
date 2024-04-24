import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ProjectVersionModel } from '../../../models/projectVersion.model';
import { ProjectService } from '../../project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectVersionService } from '../../project-version.service';
import { ItemIGroupVersionItemService } from '../../project-version-item.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-clone-project',
  templateUrl: './clone-project.component.html',
  styleUrl: './clone-project.component.css'
})
export class CloneProjectComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('clonedProject') clonedProject: EventEmitter<void>;
  form: FormGroup;
  versions?: ProjectVersionModel[];
  projectId?:number;
  name?:string;
  constructor(
    private serviceModal: NgbModal,
    private serviceProject: ProjectService,
    private serviceVersion: ProjectVersionService, 
    private serviceVersionItem: ItemIGroupVersionItemService, 
  ) {
    this.clonedProject = new EventEmitter<void>();
    this.form = new FormGroup({
      versionId: new FormControl(undefined)
    });
    
  }


  openModal(projectId:number, name:string) {
    this.projectId = projectId;
    this.getVersions();
    this.name = name
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

 


  getVersions() {
    this.serviceVersion.getProjectVersionByProject(this.projectId!).subscribe({
      next: (resp) => {
        this.versions = resp.versionProjects;
      },
    });
  }
 

  closeModal() {
    this.serviceModal.dismissAll();
  }

  clone(){
    const controls = this.form.controls;
    const versionId = controls['versionId'].value

    

    Swal.fire({
      //title: "Actualización",
      text: "Are you sure you want to clone the project?",
      icon: "info",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Clone",
      cancelButtonText:"Cancel"
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon:'info',
          allowOutsideClick: false,      
          text: 'Please wait...',
        });
        Swal.showLoading();

        this.serviceProject.cloneProject(this.projectId!)
        .subscribe({
          next: (resp) => {
            Swal.close();
            if(resp.id){
          if(versionId){
            
            this.cloneVersion(versionId, resp.id)
          }else{
            this.clonedProject.emit();
            this.closeModal()
          }
            }
          },
        });

      }
     
      
    });
  }


  cloneVersion(id:number, projectId:number){
    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Please wait...',
    });
    Swal.showLoading();

    this.serviceVersion.cloneVersionProjectByNewProject(id, projectId)
    .subscribe({
      next: (resp) => {
        Swal.close();
        if(resp.id){
        this.cloneGroupIItem(id, resp.id)
        }
      },
    });
  }

  cloneGroupIItem(idOld:number, idNew:number){
    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Please wait...',
    });
    Swal.showLoading();

    this.serviceVersionItem.cloneGroupItemVersion(idOld, idNew)
    .subscribe({
      next: (resp) => {
        Swal.close();   
        this.clonedProject.emit();
        this.closeModal()
      },
    });
  }

}
