import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import {GetNotebooks, SetActiveNotebook, CreateNotebook, ClearActiveNotebook} from '../store/notebooks.state';
import { Observable, of } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { Notebook } from '../models/notebook';

@Component({
  selector: 'app-notebooks',
  templateUrl: './notebooks.component.html',
  styleUrls: ['./notebooks.component.scss']
})

export class NotebooksComponent implements OnInit {

  @Select(state => state.notebooks.all) notebooks$: Observable<any>;
  notebooks: any[];
  notebooksMessage = '';
  isLoading = true;
  loadingMessage = 'Loading...';
  showNewNotebook = false;
  newNotebook: Notebook;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // console.log('Notebooks.ngOnInit()');
    this.notebooks$.subscribe(notebooks => {
      this.notebooks = notebooks;
      this.isLoading = false;
    });
    this.store.dispatch(new GetNotebooks())
      .subscribe(state => {
        // this will trigger subscription
      });
    // clear any active notebook data
    this.store.dispatch(new ClearActiveNotebook())
      .subscribe(null, this.handleError);
    // check to see if action is in route
    this.route.queryParamMap.subscribe(qmap => {
      const action = qmap.get('action');
      if (action) {
        if (action === 'new') {
          this.addNotebook();
        }
        // clear param from route
        this.router.navigate([], {queryParams: {action: null}, queryParamsHandling: 'merge'});
      }
    });
  }

  notebookSelect(notebook): void {
    // console.log('NotebooksComponent.notebookSelect() notebook');
    this.store.dispatch(new SetActiveNotebook(notebook))
      .subscribe(
        state => {
          this.router.navigate(['/notebook/' + notebook._id]);
        },
        this.handleError
      );
  }

  addNotebook(): void {
    // console.log('NotebooksComponent.addNotebook()');
    this.newNotebook = {
      name: '',
      Created_date: new Date()
    };
    // show notebook edit dialog
    this.showNewNotebook = true;
  }

  saveNewNotebook(notebook): void {
    // console.log('NotebooksComponent.saveNewNotebook()');
    this.loadingMessage = 'Creating new Notebook...';
    this.isLoading = true;
    this.store.dispatch(new CreateNotebook(notebook))
        .subscribe(
          state => {
            this.isLoading = false;
          },
          this.handleError
      );
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
