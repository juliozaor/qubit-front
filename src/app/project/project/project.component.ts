import { Component, ViewChild } from '@angular/core';
import { CreateProjectModalComponent } from '../projectComponent/create-project-modal/create-project-modal.component';
import { UpdateProjectModalComponent } from '../projectComponent/update-project-modal/update-project-modal.component';
import { Pager } from '../../compartido/modelos/Pager';
import { Filters } from '../../compartido/modelos/Filters';
import { ProjectModel } from '../../models/project.model';
import { ProjectService } from '../project.service';
import { MastersService } from '../../services/masters.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { Router } from '@angular/router';
import { CloneProjectComponent } from '../projectComponent/clone-project/clone-project.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectStatusModel } from '../../models/masters/projectStatus';
import { ClientService } from '../../client/client.service';
import { ClientModel } from '../../models/client.model';
import { TypeProjectModel } from '../../models/masters/typeProject';
import { TypeApplicationModel } from '../../models/masters/typeApplication';
import { ConcepDrawService } from '../../conceptDraw/concep-draw.service';
import { ConceptDrawModel } from '../../models/conceptDraw.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  @ViewChild('modalCreateProject') modalCreateProject!: CreateProjectModalComponent;
  @ViewChild('modalUpdateProject') modalUpdateProject!: UpdateProjectModalComponent;
  @ViewChild('modalCloneProject') modalCloneProject!: CloneProjectComponent;
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  projects: ProjectModel[] = [];
  term: string = '';
  showBlankRow: boolean = false;
  newProject: any = {};
  form: FormGroup;
  projectStatus: ProjectStatusModel[] = [];
  clients: ClientModel[] = [];
  typeProjects: TypeProjectModel[] = [];
  typeApplications: TypeApplicationModel[] = [];
  conceptDraws: ConceptDrawModel[] = [];
  constructor(
    private service: ProjectService,
    private route: Router,
    private serviceMaster: MastersService,
    private serviceConcept: ConcepDrawService,
    private serviceClient: ClientService,
  ) {
    this.pager = new Pager<Filters>(this.getProjects);
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      subtitle: new FormControl('', [Validators.required]),
      clientId: new FormControl(undefined, [Validators.required]),
      typeProjectId: new FormControl(undefined, [Validators.required]),
      typeApplicationId: new FormControl(undefined, [Validators.required]),
      projectStatusId: new FormControl(undefined, [Validators.required]),
      conceptnetDrawId: new FormControl(undefined, [Validators.required]),
      basepath: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getProjectStatus();
    this.getClients();
    this.getTypeApplications();
    this.getTypeProjects();
    this.getConceptDraws();
    this.pager.begin(1, 5);
  }

  getProjects = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.service.getProjects(page, limit, filters).subscribe({
        next: (resp) => {
          this.projects = resp.projects;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  showNew(){
    this.newProject = {}; 
    this.showBlankRow = true;
  }

  create() {
    this.service
      .setProject(this.newProject)
      .subscribe({
        next: () => {
          this.createdProject();
          this.showBlankRow = false; 
          this.newProject = {}; 
        },
        error: () => {
          this.popup.abrirPopupFallido(
            'Error updating Project',
            'Try again later.'
          );
        },
      });
  }

  update(project:ProjectModel) {    
    this.service
      .updateProject(project)
      .subscribe({
        next: () => {           
           this.updatedProject()
           project.editing=false;
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating project", "Try again later.")
        },
      });
  }

  getProjectStatus() {
    this.serviceMaster.getProjectStatus().subscribe({
      next: (resp) => {
        this.projectStatus = resp.projectStatus;
      },
    });
  }
  getClients() {
    this.serviceClient.getClients(1, 10000).subscribe({
      next: (resp) => {
        this.clients = resp.clients;
      },
    });
  }
  getTypeProjects() {
    this.serviceMaster.getTypeProjects().subscribe({
      next: (resp) => {
        this.typeProjects = resp.typeProject;
      },
    });
  }
  getTypeApplications() {
    this.serviceMaster.getTypeApplications().subscribe({
      next: (resp) => {
        this.typeApplications = resp.typeApplication;
      },
    });
  }

  getConceptDraws() {
    this.serviceConcept.getConceptDraws(1,100000).subscribe({
      next: (resp) => {
        this.conceptDraws = resp.conceptDraws;
      },
    });
  }

  modalCreate() {
    this.modalCreateProject.openModal();
  }

  modalUpdate(project: ProjectModel) {
    this.modalUpdateProject.openModal(project);
  }

  deleteProject(id?: number) {
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

  createdProject() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Project created successfully.');
  }
  updatedProject() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Project updated successfully.');
  }

  openVersions(projectId: number, name:string) {
    if (projectId) {
      this.route.navigate(['/dashboard/project/versions', projectId, name]);
    }
  }

  modalClone(projectId:number, name:string) {
    this.modalCloneProject.openModal(projectId, name);
  }

  clonedProject(){
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Project cloned successfully.');
  }

}
