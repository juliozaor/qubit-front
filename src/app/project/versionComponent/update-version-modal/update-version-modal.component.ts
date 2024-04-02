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

@Component({
  selector: 'app-update-version-modal',
  templateUrl: './update-version-modal.component.html',
  styleUrl: './update-version-modal.component.css',
})
export class UpdateVersionModalComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent;
  @Output('updatedVersion') updatedVersion: EventEmitter<void>;
  formulario: FormGroup;
  projectVersion?: ProjectVersionModel;
  constructor(
    private serviceModal: NgbModal,
    private service: ProjectVersionService
  ) {
    this.updatedVersion = new EventEmitter<void>();
    this.formulario = new FormGroup({
      version: new FormControl('', [Validators.required]),
      /* revisedDate: new FormControl('', [Validators.required]), */
      executiveSummary: new FormControl('', [Validators.required]),
      scopeWork: new FormControl('', [Validators.required]),
      tradingConditions: new FormControl('', [Validators.required]),
      commentClarifications: new FormControl('', [Validators.required]),
      paymentTerms: new FormControl('', [Validators.required]),
      quotePath: new FormControl('', [Validators.required]),
      quoteName: new FormControl('', [Validators.required]),
      conceptnetDrawId: new FormControl('', [Validators.required]),
    });
  }
  openModal(projectVersion: ProjectVersionModel) {
    this.projectVersion = projectVersion;
    this.fillForm(projectVersion);
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(projectVersion: ProjectVersionModel) {
    const controls = this.formulario.controls;
    controls['version'].setValue(projectVersion.version);
   /*  controls['revisedDate'].setValue(projectVersion.revisedDate); */
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
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.service
      .updateProjectVersion({
        id: this.projectVersion?.id,
        version: controls['version'].value,
        /* revisedDate: controls['revisedDate'].value, */
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


  closeModal() {
    this.serviceModal.dismissAll();
  }
}
