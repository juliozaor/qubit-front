import { Component, ViewChild } from '@angular/core';
import { ConcepDrawService } from '../concep-draw.service';
import { ConceptDrawModel } from '../../models/conceptDraw.model';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { CreateConcepDrawModalComponent } from '../create-concep-draw-modal/create-concep-draw-modal.component';
import { UpdateConcepDrawModalComponent } from '../update-concep-draw-modal/update-concep-draw-modal.component';
import { Pager } from '../../compartido/modelos/Pager';
import { Filters } from '../../compartido/modelos/Filters';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';

@Component({
  selector: 'app-concep-draw',
  templateUrl: './concep-draw.component.html',
  styleUrl: './concep-draw.component.css'
})
export class ConcepDrawComponent {
  @ViewChild('modalCreateConceptDraw') modalCreateConceptDraw!: CreateConcepDrawModalComponent;
  @ViewChild('modalUpdateConceptDraw') modalUpdateConceptDraw!: UpdateConcepDrawModalComponent;
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  conceptDraws: ConceptDrawModel[] = [];
  term: string = '';
  constructor(private service: ConcepDrawService) {
    this.pager = new Pager<Filters>(this.getConceptDraws);
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }

  getConceptDraws = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.service.getConceptDraws(page, limit, filters).subscribe({
        next: (resp) => {
          this.conceptDraws = resp.conceptDraws;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateConceptDraw.openModal();
  }

  modalUpdate(ConceptDraw: ConceptDrawModel) {
    this.modalUpdateConceptDraw.openModal(ConceptDraw);
  }

  deleteConceptDraw(id?: number) {
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

  createdConceptDraw() {
    console.log('Emitio');
    
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('ConceptDraw created successfully.');
  }
  updatedConceptDraw() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('ConceptDraw updated successfully.');
  }
}
