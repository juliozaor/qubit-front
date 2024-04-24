import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectVersionService } from '../../project-version.service';
import { ProjectVersionModel } from '../../../models/projectVersion.model';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { ConceptDrawModel } from '../../../models/conceptDraw.model';
import { ConcepDrawService } from '../../../conceptDraw/concep-draw.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-update-version-modal',
  templateUrl: './update-version-modal.component.html',
  styleUrl: './update-version-modal.component.css',
})
export class UpdateVersionModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('updatedVersion') updatedVersion: EventEmitter<void>;
  form: FormGroup;
  projectVersion?: ProjectVersionModel;
  name?:string;
  conceptDraws: ConceptDrawModel[] = [];
  constructor(
    private serviceModal: NgbModal,
    private service: ProjectVersionService,    
    private serviceConcept: ConcepDrawService,
  ) {
    this.updatedVersion = new EventEmitter<void>();
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

  openModal(projectVersion: ProjectVersionModel, name:string) {
    this.projectVersion = projectVersion;
    this.name = name;
    this.fillForm(projectVersion);
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(projectVersion: ProjectVersionModel) {

    const controls = this.form.controls;
    const fecha = new Date(projectVersion.revisedDate?.toString()!);
    const fechaFormateada = fecha.toISOString().slice(0, 16);
    controls['revisedDate'].setValue(fechaFormateada);

    controls['version'].setValue(projectVersion.version);
    controls['executiveSummary'].setValue(projectVersion.executiveSummary);
    controls['scopeWork'].setValue(projectVersion.scopeWork);
    controls['tradingConditions'].setValue(projectVersion.tradingConditions);
    controls['commentClarifications'].setValue(
      projectVersion.commentClarifications
    );
    controls['paymentTerms'].setValue(projectVersion.paymentTerms);
    controls['quotePath'].setValue(projectVersion.quotePath);
    controls['quoteName'].setValue(projectVersion.quoteName);
    controls['conceptnetDrawId'].setValue(projectVersion.conceptnetDrawId);
  }

  update() {
    if (this.form.invalid) {
      markFormAsDirty(this.form);
      return;
    }
    const controls = this.form.controls;
    this.service
      .updateProjectVersion({
        id: this.projectVersion?.id,
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
        projectId: this.projectVersion?.projectId
      })
      .subscribe({
        next: () => {
          this.updatedVersion.emit();
          this.closeModal();
        },
        error: () => {
          this.popup.abrirPopupFallido(
            'Error updating project',
            'Try again later.'
          );
        },
      });
  }

  getConceptDraws() {
    console.log("Entro");
    
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
