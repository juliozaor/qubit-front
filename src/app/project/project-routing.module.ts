import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectVersionComponent } from './project-version/project-version.component';
import { GroupItemsVersionComponent } from './versionComponent/group-items-version/group-items-version.component';
import { ItemsVersionComponent } from './versionComponent/items-version/items-version.component';
import { UpdateVersionComponent } from './versionComponent/update-version/update-version.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent
  },{
    path: 'versions/:projectId/:name',
    component: ProjectVersionComponent
  },{
    path: 'groupItems/:projectVersionId',
    component: GroupItemsVersionComponent
  },{
    path: 'itemsVersion/:groupId',
    component: ItemsVersionComponent
  },{
    path: 'updateVersion/:versionId/:name/:projectId',
    component: UpdateVersionComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
