import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { ProjectModel } from '../../../models/project.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../project.service';
import { MastersService } from '../../../services/masters.service';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { ClientModel } from '../../../models/client.model';
import { ProjectStatusModel } from '../../../models/masters/projectStatus';
import { ClientService } from '../../../client/client.service';
import { TypeProjectModel } from '../../../models/masters/typeProject';
import { TypeApplicationModel } from '../../../models/masters/typeApplication';
import { ConcepDrawService } from '../../../conceptDraw/concep-draw.service';
import { ConceptDrawModel } from '../../../models/conceptDraw.model';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.css',
})
export class CreateProjectModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('createdProject') createdProject: EventEmitter<void>;
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
    this.createdProject = new EventEmitter<void>();
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

  openModal() {
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  create() {
    if (this.form.invalid) {
      markFormAsDirty(this.form);
      return;
    }
    const controls = this.form.controls;
    this.serviceProject
      .setProject({
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
          this.createdProject.emit();
          this.clearForm();
          this.closeModal();
        },
        error: () => {
          this.popup.abrirPopupFallido(
            'Error updating Project',
            'Try again later.'
          );
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
  
  clearForm(){
    this.form.reset()
    this.form.get('typeApplicationId')!.setValue("")
    this.form.get('typeProjectId')!.setValue("")
    this.form.get('clientId')!.setValue("")
    this.form.get('conceptnetDrawId')!.setValue("")
    this.form.get('projectStatusId')!.setValue("")
  }

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
