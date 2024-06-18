import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { EditorComponent } from './pages/editor/editor.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
            ),
      },{
        path: 'items',
        loadChildren: () =>
          import('./items/items.module').then(
            (m) => m.ItemsModule
            ),
      },{
        path: 'items-group',
        loadChildren: () =>
          import('./itemGroup/item-group.module').then(
            (m) => m.ItemGroupModule
            ),
      },{
        path: 'project',
        loadChildren: () =>
          import('./project/project.module').then(
            (m) => m.ProjectModule
            ),
      },{
        path: 'client',
        loadChildren: () =>
          import('./client/client.module').then(
            (m) => m.ClientModule
            ),
      },{
        path: 'concept-draw',
        loadChildren: () =>
          import('./conceptDraw/concep-draw.module').then(
            (m) => m.ConcepDrawModule
            ),
      },{
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(
            (m) => m.ReportsModule
            ),
      },
      { path: 'home', component: HomeComponent },
      { path: 'editor', component: EditorComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
    canActivate: [authGuard], // proteccion de rutas
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
