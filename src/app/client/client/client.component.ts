import { Component, ViewChild } from '@angular/core';
import { ClientModel } from '../../models/client.model';
import { ClientCreateModalComponent } from '../client-create-modal/client-create-modal.component';
import { ClientUpdateModalComponent } from '../client-update-modal/client-update-modal.component';
import { Pager } from '../../compartido/modelos/Pager';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { Filters } from '../../compartido/modelos/Filters';
import { ClientService } from '../client.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

  @ViewChild('modalCreateClient') modalCreateClient!: ClientCreateModalComponent;
  @ViewChild('modalUpdateClient') modalUpdateClient!: ClientUpdateModalComponent;
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  clients: ClientModel[] = [];
  term: string = '';
  constructor(private service: ClientService) {
    this.pager = new Pager<Filters>(this.getClients);
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }

  getClients = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.service.getClients(page, limit, filters).subscribe({
        next: (resp) => {
          this.clients = resp.clients;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateClient.openModal();
  }

  modalUpdate(client: ClientModel) {
    this.modalUpdateClient.openModal(client);
  }

  deleteClient(id?: number) {
    console.log(id);
  }

  updateFilters() {
    this.pager.filter({
      term: this.term,
    });
  }

  clearFilters() {
    this.term = '';
    this.pager.filter({});
  }

  createdClient() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Client created successfully.');
  }
  updatedClient() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Client updated successfully.');
  }
}
