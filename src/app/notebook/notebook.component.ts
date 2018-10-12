import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GetNotes, SetActiveNote } from '../store/notes.state';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteActiveNotebook, GetNotebooks, SetActiveNotebookById, SetActiveNotebookMode, UpdateNotebook } from '../store/notebooks.state';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

  @Select(state => state.notes.all) notes$: Observable<any>;
  @Select(state => state.notebooks.active) notebook$: Observable<any>;
  @Select(state => state.notebooks.mode) mode$: Observable<any>;

  notebook: any;
  notes: any[];
  isLoading = true;
  loadingMessage = 'Loading...';
  showConfirmModal = false;
  showEditNotebook = false;
  notebookDeleteMsg: string;
  activeView = 'notebook';
  showMapInit = false;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // console.log('Notebook.ngOnInit()');
    this.notebook$.subscribe(notebook => {
      if (notebook) {
        if (!this.notebook) {
          // get notes
          this.getNotes(notebook._id);
        } else if (this.notebook._id !== notebook._id) {
          // next/previous
          this.getNotes(notebook._id);
        } else if (!this.notes) {
          // unclear why this condition might exist
          this.getNotes(notebook._id);
        }
        this.notebook = notebook;
      } else {
        // Must be first load of deep-link url
        // Get notebook_id from route
        this.route.paramMap.subscribe(paramMap => {
          // check for id in route and load notebook data
          if (paramMap.has('notebook_id')) {
            const id: string = paramMap.get('notebook_id');
            if (id) {
              // Get Notebooks
              this.store.dispatch(new GetNotebooks())
                .subscribe(state => {
                  // Set This notebook as active
                  this.store.dispatch(new SetActiveNotebookById(id))
                    .subscribe(() => {
                      // Setting active notebook will retrigger this subscription and get notes
                    });
                });
            }
          }
        });
      }
    });
    // listen for route changes in this component
    this.mode$.subscribe(mode => {
      // console.log(`Notebook.ngOnInit() mode [${mode}]`);
      if (mode === 'map' && !this.showMapInit) {
        // first map load
        if (!this.isLoading && this.notes.length > 0) {
          this.showMapInit = true;
        } else {
          const sub = this.notes$.subscribe(notes => {
            if (sub) { sub.unsubscribe(); }
            // this fire at the some time as getNotes() so add slight delay to insure notes are loaded before showing map
            setTimeout(() => this.showMapInit = true, 100);
          });
        }
      }
      this.activeView = mode;
    });
  }

  getNotes(notebook_id: string): void {
    // console.log(`NotebookComponent.getNotes() id: ${notebook_id}`);
    this.store.dispatch(new GetNotes(notebook_id))
      .subscribe(state => {
        this.notes = state.notes.all;
        this.isLoading = false;
      });
  }

  noteSelect(note): void {
    // console.log('NotebookComponent.noteSelect()');
    this.store.dispatch(new SetActiveNote(note))
      .subscribe(state => {
        this.router.navigate(['/note/' + note._id]);
      });
  }

  deleteNotebook(): void {
    // console.log('NotebookComponent.deleteNotebook()');
    // Show confirm dialog
    this.notebookDeleteMsg = (this.notes.length > 0) ? '<b style="color:darkred;">All ' + (this.notes.length > 2 ? this.notes.length : '') +
      ' notes</b> in this notebook will be deleted. ' : '';
    this.showConfirmModal = true;
  }

  confirmNotebookDelete(): void {
    // console.log('NotebookComponent.confirmNotebookDelete()');
    this.store.dispatch(new DeleteActiveNotebook(this.notebook._id))
      .subscribe(state => {
        this.router.navigate(['/notebooks']);
      });
  }

  editNotebook(): void {
    // console.log('NotebookComponent.editNotebook()');
    this.showEditNotebook = true;
  }

  saveNotebook(notebook): void {
    // console.log('NotebookComponent.saveNotebook()');
    this.loadingMessage = 'Updating Notebook...';
    this.isLoading = true;
    this.store.dispatch(new UpdateNotebook(notebook))
      .subscribe(() => {
        this.isLoading = false;
      },
        this.handleError
    );
  }

  showMap(): void {
    // console.log('NotebookComponent.showMap()');
    this.store.dispatch(new SetActiveNotebookMode('map'));
    // this will trigger subscription in ngOnInit
  }

  closeNotebookMap(): void {
    // console.log('NotebookComponent.closeNotebookMap()');
    this.store.dispatch(new SetActiveNotebookMode('notebook'));
    // this will trigger subscription in ngOnInit
  }

  addNote(device): void {
    // console.log('NotebookComponent.addNote()');
    this.router.navigate(['/note-new/' + this.notebook._id], {queryParams: {'device': device}});
  }

  private handleError<T> (operation = 'operation', result?: T) {
    this.isLoading = false;
    return (error: any): Observable<T> => {

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
