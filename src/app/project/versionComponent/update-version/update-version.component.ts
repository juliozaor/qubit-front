import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConceptDrawModel } from '../../../models/conceptDraw.model';
import { ProjectVersionService } from '../../project-version.service';
import { ConcepDrawService } from '../../../conceptDraw/concep-draw.service';
import { markFormAsDirty } from '../../../utilidades/Utilidades';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-version',
  templateUrl: './update-version.component.html',
  styleUrl: './update-version.component.css'
})
export class UpdateVersionComponent {

  @ViewChild('popup') popup!: PopupComponent;
  form: FormGroup;
  projectVersion?: any;
  versionId?: number;
  projectId?:number;
  name?:string;
  conceptDraws: ConceptDrawModel[] = [];
  constructor(
    private route:Router,
    private routeActive: ActivatedRoute,
    private service: ProjectVersionService,    
    private serviceConcept: ConcepDrawService,
  ) {
    this.routeActive.params.subscribe(params => {
      this.versionId = params['versionId'];  
      this.name = params['name'];      
      this.projectId = params['projectId'];      
    });
    
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
    this.getVersions();

  }

  getVersions = () => {    
      this.service.getProjectVersion(this.versionId!).subscribe({
        next: (resp) => {          
          this.projectVersion = resp;
          if(this.projectVersion){
            this.fillForm(this.projectVersion);
          }
        },
      });
  };

 

  fillForm(projectVersion: any) {
    const controls = this.form.controls;
    const fecha = new Date(projectVersion.revised_date?.toString());    
    const fechaFormateada = fecha.toISOString().slice(0, 16);
    controls['revisedDate'].setValue(fechaFormateada);

    controls['version'].setValue(projectVersion.version);
    controls['executiveSummary'].setValue(projectVersion.executive_summary);
    controls['scopeWork'].setValue(projectVersion.scope_work);
    controls['tradingConditions'].setValue(projectVersion.trading_conditions);
    controls['commentClarifications'].setValue(
      projectVersion.comment_clarifications
    );
    controls['paymentTerms'].setValue(projectVersion.payment_terms);
    controls['quotePath'].setValue(projectVersion.quote_path);
    controls['quoteName'].setValue(projectVersion.quote_name);
    controls['conceptnetDrawId'].setValue(projectVersion.conceptnet_draw_id);
  }

  update() {
    if (this.form.invalid) {
      markFormAsDirty(this.form);
      return;
    }
    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Please wait...',
    });
    Swal.showLoading();
    
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
        projectId: this.projectVersion?.project_id
      })
      .subscribe({
        next: () => {
          Swal.close();       
          this.popup.abrirPopupExitoso('Update completed successfully')
        },
        error: () => {
          Swal.close(); 
          this.popup.abrirPopupFallido(
            'Error updating version',
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

  UpdateIndicators(){
    console.log("Indicators");
    
  }

  back(){
    this.route.navigate([`/dashboard/project/versions/${ this.projectId }/${ this.name }`]);
  }

}
