import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { ProjectVersionComponent } from './project-version/project-version.component';
import { CreateProjectModalComponent } from './projectComponent/create-project-modal/create-project-modal.component';
import { UpdateProjectModalComponent } from './projectComponent/update-project-modal/update-project-modal.component';
import { ProjectRoutingModule } from './project-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../components/components.module';
import { AlertasModule } from '../alertas/alertas.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { UpdateVersionModalComponent } from './versionComponent/update-version-modal/update-version-modal.component';
import { CreateVersionModalComponent } from './versionComponent/create-version-modal/create-version-modal.component';
import { GroupItemsVersionComponent } from './versionComponent/group-items-version/group-items-version.component';
import { ItemsVersionComponent } from './versionComponent/items-version/items-version.component';
import { CreateItemsVersionModalComponent } from './versionComponent/create-items-version-modal/create-items-version-modal.component';
import { UpdateItemsVersionModalComponent } from './versionComponent/update-items-version-modal/update-items-version-modal.component';



@NgModule({
  declarations: [
    ProjectComponent,
    ProjectVersionComponent,
    CreateProjectModalComponent,
    UpdateProjectModalComponent,
    UpdateVersionModalComponent,
    CreateVersionModalComponent,
    GroupItemsVersionComponent,
    ItemsVersionComponent,
    CreateItemsVersionModalComponent,
    UpdateItemsVersionModalComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ComponentsModule,    
    AlertasModule,
    NgSelectModule,
    MatIconModule
  ]
})
export class ProjectModule { }
