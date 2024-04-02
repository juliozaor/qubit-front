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
  pager: Pager<Filters>;
  versionProjects?:ProjectVersionModel[]
  term: string = '';
  
  constructor(private routeActive: ActivatedRoute, 
    private service: ProjectService, 
    private serviceVersion: ProjectVersionService, 
    private route: Router){
    this.routeActive.params.subscribe(params => {
      this.projectId = params['projectId'];        
    });
    this.pager = new Pager<Filters>(this.getVersions);
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }  

  getVersions = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.serviceVersion.getProjectVersionByProject(this.projectId!, page, limit, filters).subscribe({
        next: (resp) => {          
          this.versionProjects = resp.versionProjects;
          console.log(this.versionProjects);
          
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateVersion.openModal(this.projectId!);
  }

  modalUpdate(version: ProjectVersionModel) {
    this.modalUpdateVersion.openModal(version);
  }

  cloneVersion(id: number){

  }

  openGroups(projectVersionId: number) {
    console.log(projectVersionId);
    
    if (projectVersionId) {
      this.route.navigate(['/dashboard/project/groupItems', projectVersionId]);
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

}
