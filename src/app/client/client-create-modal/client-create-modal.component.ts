import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClientModel } from '../../models/client.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../client.service';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { markFormAsDirty } from '../../utilidades/Utilidades';

@Component({
  selector: 'app-client-create-modal',
  templateUrl: './client-create-modal.component.html',
  styleUrl: './client-create-modal.component.css'
})
export class ClientCreateModalComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('createdClient') createdClient: EventEmitter<void>;
  form: FormGroup;
  client?: ClientModel;
  constructor(
    private serviceModal: NgbModal,
    private service: ClientService
  ) {
    this.createdClient = new EventEmitter<void>();
    this.form = new FormGroup({
      names: new FormControl('', [Validators.required]),
      surnames: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
     
    });
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
      .setClient({
        names: controls['names'].value,
        surnames: controls['surnames'].value,
        email: controls['email'].value
      })
      .subscribe({
        next: () => {
           this.createdClient.emit();
           this.clearForm();
           this.closeModal();
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating client", "Try again later.")
        },
      });
  }

  clearForm(){
    this.form.reset()
  }

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
