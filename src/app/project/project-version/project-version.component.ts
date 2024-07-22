import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { Pager } from '../../compartido/modelos/Pager';
import { Filters } from '../../compartido/modelos/Filters';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { ProjectVersionService } from '../project-version.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { ProjectVersionModel } from '../../models/projectVersion.model';
import { CreateVersionModalComponent } from '../versionComponent/create-version-modal/create-version-modal.component';
import { UpdateVersionModalComponent } from '../versionComponent/update-version-modal/update-version-modal.component';
import Swal from 'sweetalert2';
import { ConceptDrawModel } from '../../models/conceptDraw.model';
import { ConcepDrawService } from '../../conceptDraw/concep-draw.service';
import { ItemIGroupVersionItemService } from '../project-version-item.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-version',
  templateUrl: './project-version.component.html',
  styleUrl: './project-version.component.css'
})
export class ProjectVersionComponent {
  @ViewChild('modalCreateVersion') modalCreateVersion!: CreateVersionModalComponent;
  @ViewChild('modalUpdateVersion') modalUpdateVersion!: UpdateVersionModalComponent;
  @ViewChild('popup') popup!: PopupComponent;

  projectId?:number
  name?:string;
  pager: Pager<Filters>;
  versionProjects?:ProjectVersionModel[]
  term: string = '';
  showBlankRow: boolean = false;
  newProjectVersion: any = {};
  form: FormGroup;
  conceptDraws: ConceptDrawModel[] = [];

  
  constructor(private routeActive: ActivatedRoute, 
    private service: ProjectService, 
    private serviceVersion: ProjectVersionService, 
    private serviceVersionItem: ItemIGroupVersionItemService, 
    private serviceConcept: ConcepDrawService,
    private route: Router) {
      this.form = new FormGroup({         
        version: new FormControl('', [Validators.required]),
        revisedDate: new FormControl('', [Validators.required]),
        executiveSummary: new FormControl('', [Validators.required]),
        scopeWork: new FormControl('', [Validators.required]),
        tradingConditions: new FormControl('', [Validators.required]),
        commentClarifications: new FormControl('', [Validators.required]),
        paymentTerms: new FormControl('', [Validators.required]),
        quotePath: new FormControl('', [Validators.required]),
        quoteName: new FormControl('', [Validators.required]),
        conceptnetDrawId: new FormControl('', [Validators.required]),
  
      });
      this.getConceptDraws();
    this.routeActive.params.subscribe(params => {
      this.projectId = params['projectId'];  
      this.name = params['name'];      
    });
    
    this.pager = new Pager<Filters>(this.getVersions);
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }  

  showNew(){
    this.newProjectVersion = {}; 
    this.showBlankRow = true;
  }

  create() {
    this.serviceVersion
      .setProjectVersion(this.newProjectVersion)
      .subscribe({
        next: () => {
          this.createdVersion();
          this.showBlankRow = false; 
          this.newProjectVersion = {}; 
        },
        error: () => {
          this.popup.abrirPopupFallido(
            'Error updating Project',
            'Try again later.'
          );
        },
      });
  }

  updateVersion(versionProject:ProjectVersionModel) {    
    this.serviceVersion
      .updateProjectVersion(versionProject)
      .subscribe({
        next: () => {           
           this.updatedVersion()
           versionProject.editing=false;
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating project", "Try again later.")
        },
      });
  }

  closeCreate() {
    this.showBlankRow = false;
    this.newProjectVersion = {};
  }

  closeUpdate(versionProject:ProjectVersionModel) {
    versionProject.editing = false
    this.pager.refrescar();
  }
  getConceptDraws() {
    this.serviceConcept.getConceptDraws(1,100000).subscribe({
      next: (resp) => {
        this.conceptDraws = resp.conceptDraws;
      },
    });
  }

  getVersions = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.serviceVersion.getProjectVersionByProject(this.projectId!, page, limit, filters).subscribe({
        next: (resp) => {          
          this.versionProjects = resp.versionProjects;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateVersion.openModal(this.projectId!, this.name!);
  }

  modalUpdate(version: ProjectVersionModel) {
    this.modalUpdateVersion.openModal(version, this.name!);
  }
  

  openGroups(projectVersionId: number) {
    if (projectVersionId) {
      this.route.navigate(['/dashboard/project/groupItems', projectVersionId, 1]);
    }
  }

  calcEstimate(projectVersionId: number) {
    if (projectVersionId) {
      this.route.navigate(['/dashboard/project/calEstimate', projectVersionId]);
    }
  }

  createdVersion() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('version created successfully.');
  }

  updatedVersion() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('version updated successfully.');
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

  cloneVersion(id:number){
    Swal.fire({
      //title: "Actualización",
      text: "Are you sure you want to clone the version?",
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

        this.serviceVersion.cloneProjectVersion(id)
        .subscribe({
          next: (resp) => {
            console.log(resp.id);
            Swal.close();
            if(resp.id){
            this.cloneGroupIItem(id, resp.id)
            }
            this.pager.refrescar();
          },
        });

      }
     
      
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
        this.popup.abrirPopupExitoso('Cloning completed successfully')
        this.pager.refrescar();
      },
    });
  }

  back(){
    this.route.navigate(['/dashboard/project']);
  }

  update(version:number) {    
    this.route.navigate([`/dashboard/project/updateVersion/${ version }/${ this.name }/${ this.projectId }`]);
  }


}
