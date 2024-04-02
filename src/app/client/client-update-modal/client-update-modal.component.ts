import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientModel } from '../../models/client.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../client.service';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-client-update-modal',
  templateUrl: './client-update-modal.component.html',
  styleUrl: './client-update-modal.component.css'
})
export class ClientUpdateModalComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('updatedClient') updatedClient: EventEmitter<void>;
  formulario: FormGroup;
  client?: ClientModel;
  constructor(
    private serviceModal: NgbModal,
    private service: ClientService
  ) {
    this.updatedClient = new EventEmitter<void>();
    this.formulario = new FormGroup({
      names: new FormControl('', [Validators.required]),
      surnames: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });
  }


  openModal(client:ClientModel) {
    this.client = client
    this.fillForm(client);    
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(client:ClientModel){
    const controls = this.formulario.controls
    controls['names'].setValue(client.names)
    controls['surnames'].setValue(client.surnames)
    controls['email'].setValue(client.email)
  }

  update() {
    if (this.formulario.invalid) {
      markFormAsDirty(this.formulario);
      return;
    }
    const controls = this.formulario.controls;
    this.service
      .updateClient({
        id: this.client?.id,
        names: controls['names'].value,
        surnames: controls['surnames'].value,
        email: controls['email'].value
      })
      .subscribe({
        next: () => {
           this.updatedClient.emit();
           this.closeModal()
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating Client", "Try again later.")
        },
      });
  }


  closeModal() {
    this.serviceModal.dismissAll();
  }

  clearForm(){
    this.formulario.reset()
  }
}
