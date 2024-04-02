import { Component, ViewChild } from '@angular/core';
import { CreateProjectModalComponent } from '../projectComponent/create-project-modal/create-project-modal.component';
import { UpdateProjectModalComponent } from '../projectComponent/update-project-modal/update-project-modal.component';
import { Pager } from '../../compartido/modelos/Pager';
import { Filters } from '../../compartido/modelos/Filters';
import { ProjectModel } from '../../models/project.model';
import { ProjectService } from '../project.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  @ViewChild('modalCreateProject') modalCreateProject!: CreateProjectModalComponent;
  @ViewChild('modalUpdateProject') modalUpdateProject!: UpdateProjectModalComponent;
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  projects: ProjectModel[] = [];
  term: string = '';
  constructor(private service: ProjectService, private route: Router) {
    this.pager = new Pager<Filters>(this.getProjects);
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }

  getProjects = (page: number, limit: number, filters?: Filters) => {    
    return new Observable<Pagination>((subscribe) => {
      this.service.getProjects(page, limit, filters).subscribe({
        next: (resp) => {
          this.projects = resp.projects;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  modalCreate() {
    this.modalCreateProject.openModal();
  }

  modalUpdate(project: ProjectModel) {
    this.modalUpdateProject.openModal(project);
  }

  deleteProject(id?: number) {
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

  createdProject() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Project created successfully.');
  }
  updatedProject() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Project updated successfully.');
  }

  openVersions(projectId: number) {
    if (projectId) {
      this.route.navigate(['/dashboard/project/versions', projectId]);
    }
  }

}
