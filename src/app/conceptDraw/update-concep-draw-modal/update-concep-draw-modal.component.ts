import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientModel } from '../../models/client.model';
import { TypeProjectModel } from '../../models/masters/typeProject';
import { TypeApplicationModel } from '../../models/masters/typeApplication';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConcepDrawService } from '../concep-draw.service';
import { ConceptDrawModel } from '../../models/conceptDraw.model';
import { MastersService } from '../../services/masters.service';
import { ClientService } from '../../client/client.service';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-update-concep-draw-modal',
  templateUrl: './update-concep-draw-modal.component.html',
  styleUrl: './update-concep-draw-modal.component.css'
})
export class UpdateConcepDrawModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('updatedConceptDraw') updatedConceptDraw: EventEmitter<void>;
  formulario: FormGroup;
  conceptDraws?: ConceptDrawModel;
  clients: ClientModel[] = [];
  typeProjects: TypeProjectModel[] = [];
  typeApplications: TypeApplicationModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private service: ConcepDrawService,
    private serviceMaster: MastersService,
    private serviceClient: ClientService
  ) {
    this.updatedConceptDraw = new EventEmitter<void>();
    this.formulario = new FormGroup({
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

  openModal(conceptDraws:ConceptDrawModel) {
    this.conceptDraws = conceptDraws
    this.fillForm(conceptDraws);    
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(conceptDraws:ConceptDrawModel){
    const controls = this.formulario.controls
    controls['code'].setValue(conceptDraws.code)
    controls['name'].setValue(conceptDraws.name)
    controls['clientId'].setValue(conceptDraws.clientId)
    controls['typeApplicationId'].setValue(conceptDraws.typeApplicationId)
    controls['typeProjectId'].setValue(conceptDraws.typeProjectId)
    controls['version'].setValue(conceptDraws.version)
    controls['xmlBase'].setValue(conceptDraws.xmlBase)
    controls['xmlAutocad'].setValue(conceptDraws.xmlAutocad)
    controls['csvQuote'].setValue(conceptDraws.csvQuote)    
  }

  update() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.service
      .updateConceptDraw({
        id: this.conceptDraws?.id,
        code: controls['code'].value,
        name: controls['name'].value,
        clientId: controls['clientId'].value,
        typeApplicationId: controls['typeApplicationId'].value,
        typeProjectId: controls['typeProjectId'].value,
        version: controls['version'].value,
        xmlBase: controls['xmlBase'].value,
        xmlAutocad: controls['xmlAutocad'].value,
        csvQuote: controls['csvQuote'].value,
      })
      .subscribe({
        next: () => {
           this.updatedConceptDraw.emit();
           this.closeModal()
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating conceptDraws", "Try again later.")
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
  

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
