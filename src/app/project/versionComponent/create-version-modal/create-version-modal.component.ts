import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectVersionService } from '../../project-version.service';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { ConceptDrawModel } from '../../../models/conceptDraw.model';
import { ConcepDrawService } from '../../../conceptDraw/concep-draw.service';

@Component({
  selector: 'app-create-version-modal',
  templateUrl: './create-version-modal.component.html',
  styleUrl: './create-version-modal.component.css'
})
export class CreateVersionModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('createdVersion') createdVersion: EventEmitter<void>;
  form: FormGroup;
  version?: ProjectVersionService;
  projectId?:number;
  name?:string;
  conceptDraws: ConceptDrawModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private service: ProjectVersionService,    
    private serviceConcept: ConcepDrawService,
  ) {
    this.createdVersion = new EventEmitter<void>();
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
  }

  openModal(projectId:number, name:string) {
    this.projectId = projectId
    this.name = name
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
      .setProjectVersion({
        version: controls['version'].value,
        revisedDate: controls['revisedDate'].value,
        executiveSummary: controls['executiveSummary'].value,
        scopeWork: controls['scopeWork'].value,
        tradingConditions: controls['tradingConditions'].value,
        commentClarifications: controls['commentClarifications'].value,
        paymentTerms: controls['paymentTerms'].value,
        quotePath: controls['quotePath'].value,
        quoteName: controls['quoteName'].value,
        conceptnetDrawId: controls['conceptnetDrawId'].value,
        projectId: this.projectId
      })
      .subscribe({
        next: () => {
          this.createdVersion.emit();
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

  getConceptDraws() {
    this.serviceConcept.getConceptDraws(1,100000).subscribe({
      next: (resp) => {
        this.conceptDraws = resp.conceptDraws;
      },
    });
  }

  clearForm(){
    this.form.reset()
    this.form.get('conceptnetDrawId')!.setValue("")
  }


  closeModal() {
    this.serviceModal.dismissAll();
  }
}
