import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConceptDrawModel } from '../../models/conceptDraw.model';
import { ClientModel } from '../../models/client.model';
import { TypeProjectModel } from '../../models/masters/typeProject';
import { TypeApplicationModel } from '../../models/masters/typeApplication';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MastersService } from '../../services/masters.service';
import { ClientService } from '../../client/client.service';
import { markFormAsDirty } from '../../utilidades/Utilidades';
import { ConcepDrawService } from '../concep-draw.service';

@Component({
  selector: 'app-create-concep-draw-modal',
  templateUrl: './create-concep-draw-modal.component.html',
  styleUrl: './create-concep-draw-modal.component.css'
})
export class CreateConcepDrawModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('createdConceptDraw') createdConceptDraw: EventEmitter<void>;
  form: FormGroup;
  clients: ClientModel[] = [];
  typeProjects: TypeProjectModel[] = [];
  typeApplications: TypeApplicationModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private service: ConcepDrawService,
    private serviceMaster: MastersService,
    private serviceClient: ClientService
  ) {
    this.createdConceptDraw = new EventEmitter<void>();
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      clientId: new FormControl(undefined, [Validators.required]),
      typeApplicationId: new FormControl(undefined, [Validators.required]),
      typeProjectId: new FormControl(undefined, [Validators.required]),      
      version: new FormControl(undefined, [Validators.required]),
      xmlBase: new FormControl('', [Validators.required]),
      xmlAutocad: new FormControl('', [Validators.required]),
      csvQuote: new FormControl('', [Validators.required]),
      

    });
  }

  ngOnInit(): void {
    this.getClients();
    this.getTypeApplications();
    this.getTypeProjects();
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
    this.service
      .setConceptDraw({
        code: controls['code'].value,
        name: controls['name'].value,
        clientId: controls['clientId'].value,
        typeApplicationId: controls['typeApplicationId'].value,
        typeProjectId: controls['typeProjectId'].value,
        version: controls['version'].value,
        xmlBase: controls['xmlBase'].value,
        xmlAutocad: controls['xmlAutocad'].value,
        csvQuote: controls['csvQuote'].value
      })
      .subscribe({
        next: () => {
          this.createdConceptDraw.emit();
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
  
  clearForm(){
    this.form.reset()
    this.form.get('typeApplicationId')!.setValue("")
    this.form.get('typeProjectId')!.setValue("")
    this.form.get('clientId')!.setValue("")
  }

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
