import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { NotebooksComponent } from './notebooks/notebooks.component';
import { NotebooksService } from './services/notebooks.service';
import { NotebooksState } from './store/notebooks.state';
import { NotesState } from './store/notes.state';
import { NotebookComponent } from './notebook/notebook.component';
import { NoteComponent } from './note/note.component';
import { ModalDailogComponent } from './modal-dailog/modal-dailog.component';
import { NotebookEditComponent } from './notebook-edit/notebook-edit.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { GoogleMapsConfig } from './google-maps.config';
import { NotebookMapComponent } from './notebook-map/notebook-map.component';
import { PlacesDialogComponent } from './places-dialog/places-dialog.component';
import { NoteMapComponent } from './note-map/note-map.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotebooksComponent,
    NotebookComponent,
    NoteComponent,
    ModalDailogComponent,
    NotebookEditComponent,
    NoteEditComponent,
    NotebookMapComponent,
    PlacesDialogComponent,
    NoteMapComponent
  ],
  imports: [
    NgxsModule.forRoot([NotebooksState, NotesState]),
    BrowserModule,
    AppRoutingModule,
    MomentModule,
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot(GoogleMapsConfig)
  ],
  providers: [
    NotebooksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
