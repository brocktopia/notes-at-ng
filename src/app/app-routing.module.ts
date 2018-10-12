import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {NotebooksComponent} from './notebooks/notebooks.component';
import {NotebookComponent} from './notebook/notebook.component';
import {NoteComponent} from './note/note.component';
import {NoteEditComponent} from './note-edit/note-edit.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'notebooks',
    component: NotebooksComponent
  },
  {
    path: 'notebook/:notebook_id',
    component: NotebookComponent
  },
  {
    path: 'note/:note_id',
    component: NoteComponent
  },
  {
    path: 'note-edit/:note_id',
    component: NoteEditComponent
  },
  {
    path: 'note-new/:notebook_id',
    component: NoteEditComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
