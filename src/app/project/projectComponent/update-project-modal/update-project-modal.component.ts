import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectModel } from '../../../models/project.model';
import { ProjectStatusModel } from '../../../models/masters/projectStatus';
import { ClientModel } from '../../../models/client.model';
import { TypeProjectModel } from '../../../models/masters/typeProject';
import { TypeApplicationModel } from '../../../models/masters/typeApplication';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../project.service';
import { MastersService } from '../../../services/masters.service';
import { ClientService } from '../../../client/client.service';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { ConceptDrawModel } from '../../../models/conceptDraw.model';
import { ConcepDrawService } from '../../../conceptDraw/concep-draw.service';

@Component({
  selector: 'app-update-project-modal',
  templateUrl: './update-project-modal.component.html',
  styleUrl: './update-project-modal.component.css'
})
export class UpdateProjectModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('updatedProject') updatedProject: EventEmitter<void>;
  form: FormGroup;
  project?: ProjectModel;
  projectStatus: ProjectStatusModel[] = [];
  clients: ClientModel[] = [];
  typeProjects: TypeProjectModel[] = [];
  typeApplications: TypeApplicationModel[] = [];
  conceptDraws: ConceptDrawModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private serviceProject: ProjectService,
    private serviceMaster: MastersService,
    private serviceClient: ClientService,
    private serviceConcept: ConcepDrawService,
  ) {
    this.updatedProject = new EventEmitter<void>();
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
  }

  openModal(project:ProjectModel) {
    this.project = project
    this.fillForm(project);    
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(item:ProjectModel){
    const controls = this.form.controls
    controls['code'].setValue(item.code)
    controls['name'].setValue(item.name)
    controls['subtitle'].setValue(item.subtitle)
    controls['clientId'].setValue(item.clientId)
    controls['typeProjectId'].setValue(item.typeProjectId)
    controls['typeApplicationId'].setValue(item.typeApplicationId)
    controls['projectStatusId'].setValue(item.projectStatusId)
    controls['conceptnetDrawId'].setValue(item.conceptnetDrawId)
    controls['basepath'].setValue(item.basepath)
  }

  update() {
    if (this.form.invalid) {
      markFormAsDirty(this.form);
      return;
    }
    const controls = this.form.controls;
    this.serviceProject
      .updateProject({
        id: this.project?.id,
        code: controls['code'].value,
        name: controls['name'].value,
        subtitle: controls['subtitle'].value,
        clientId: controls['clientId'].value,
        typeProjectId: controls['typeProjectId'].value,
        typeApplicationId: controls['typeApplicationId'].value,
        projectStatusId: controls['projectStatusId'].value,
        conceptnetDrawId: controls['conceptnetDrawId'].value,
        basepath: controls['basepath'].value,
      })
      .subscribe({
        next: () => {
           this.updatedProject.emit();
           this.closeModal()
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

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
