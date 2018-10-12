import { State, Action, StateContext } from '@ngxs/store';
import { NotebooksService } from '../services/notebooks.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Notebook } from '../models/notebook';

export class GetNotebooks {
  static readonly type = '[Notebooks] GetNotebooks';
}

export class CreateNotebook {
  static readonly type = '[Notebooks] CreateNotebook';
  constructor(public notebook: Notebook) {}
}

export class UpdateNotebook {
  static readonly type = '[Notebooks] UpdateNotebook';
  constructor(public notebook: Notebook) {}
}

export class SetActiveNotebook {
  static readonly type = '[Notebooks] SetActiveNotebook';
  constructor(public notebook: Notebook) {}
}

export class ClearActiveNotebook {
  static readonly type = '[Notebooks] ClearActiveNotebook';
}

export class SetActiveNotebookMode {
  static readonly type = '[Notebooks] SetActiveNotebookMode';
  constructor(public mode: string) {}
}

export class SetActiveNotebookMapState {
  static readonly type = '[Notebooks] SetActiveNotebookMapState';
  constructor(public state: object) {}
}

export class SetActiveNotebookById {
  static readonly type = '[Notebooks] SetActiveNotebookById';
  constructor(public notebook_id: string) {}
}

export class DeleteActiveNotebook {
  static readonly type = '[Notebooks] DeleteActiveNotebook';
  constructor(public notebook_id: string) {}
}

export interface NotebooksStateModel {
  all: any[];
  active: object;
  mode: string;
  mapState: object;
  scrollState: object;
}

@State<NotebooksStateModel>({
  name: 'notebooks',
  defaults: {
    all: [],
    active: null,
    mode: 'notebook',
    mapState: null,
    scrollState: null
  }
})
export class NotebooksState {
  constructor(private notebooksService: NotebooksService) {}

  @Action(GetNotebooks)
  getNotebooks(ctx: StateContext<any>) {
    // console.log('notebooks.state.getNotebooks()');
    return this.notebooksService.getNotebooks()
      .pipe(
        tap((data) => {
          const state = ctx.getState();
          ctx.setState({
            ...state,
            all: data
          });
        },
          catchError(this.handleError<any>('getNotebooks'))
      ));

  }

  @Action(CreateNotebook)
  createNotebook(ctx: StateContext<NotebooksStateModel>, action: CreateNotebook) {
    // console.log('notebooks.state.createNotebook()');
    return this.notebooksService.createNotebook(action.notebook)
      .pipe(
        tap((data) => {
          console.log('notebooks.state.createNotebook() data');
          console.dir(data);
          const state = ctx.getState();
          state.all.unshift(data);
        },
          catchError(this.handleError<any>('createNotebook'))
      ));
  }

  @Action(UpdateNotebook)
  updateNotebook(ctx: StateContext<NotebooksStateModel>, action: UpdateNotebook) {
    // console.log('notebooks.state.updateNotebook()');
    return this.notebooksService.updateNotebook(action.notebook)
      .pipe(
        tap((data) => {
          const state = ctx.getState();
            if (state.all && state.all.length > 0) {
              // swap out note in all[]
              const activeIndex = state.all.findIndex(n => n._id === action.notebook._id);
              if (activeIndex > -1) {
                state.all.splice(activeIndex, 1, data);
              } else {
                throw({message: `Could not find index [${activeIndex}] for note [${action.notebook._id}]`});
              }
            }
            // otherwise could be deep-linked first load into notebook view
            ctx.setState({
              ...state,
              active: data
            });
        },
          catchError(this.handleError<any>('createNotebook'))
      ));
  }

  @Action(SetActiveNotebook)
  setActiveNotebook(ctx: StateContext<NotebooksStateModel>, action: SetActiveNotebook) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      active: action.notebook
    });
  }

  @Action(ClearActiveNotebook)
  clearActiveNotebook(ctx: StateContext<NotebooksStateModel>, action: ClearActiveNotebook) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      active: null,
      mode: 'notebook',
      mapState: null,
      scrollState: null
    });
  }

  @Action(SetActiveNotebookById)
  setActiveNotebookById(ctx: StateContext<NotebooksStateModel>, action: SetActiveNotebookById) {
    // console.log(`notebooks.state.setActiveNotebookById() id: ${action.notebook_id}`);
    const state = ctx.getState();
    const data = state.all.find((nb: any) => {
      return nb._id === action.notebook_id;
    });
    if (data) {
      ctx.setState({
        ...state,
        active: data
      });
    } else {
      throw({message: `Could not find note with id [${action.notebook_id}]`});
    }
  }

  @Action(SetActiveNotebookMode)
  setActiveNotebookMode(ctx: StateContext<NotebooksStateModel>, action: SetActiveNotebookMode) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      mode: action.mode
    });
  }

  @Action(SetActiveNotebookMapState)
  setActiveNotebookMapState(ctx: StateContext<NotebooksStateModel>, action: SetActiveNotebookMapState) {
    // console.log(`notebooks.state.setActiveNotebookMapState() state`);
    const state = ctx.getState();
    ctx.setState({
      ...state,
      mapState: action.state
    });
  }

  @Action(DeleteActiveNotebook)
  deleteActiveNotebook(ctx: StateContext<NotebooksStateModel>, action: DeleteActiveNotebook) {
    return this.notebooksService.deleteNotebook(action.notebook_id)
      .pipe(
        tap((resp) => {
          const state = ctx.getState();
          const deletedIndex: number = state.all.findIndex(nb => nb._id === action.notebook_id);
          if (deletedIndex > -1) {
            state.all.splice(deletedIndex, 1);
          } else {
            throw({message: `Unable to find index of deleted notebook [${action.notebook_id}].`});
          }
        })
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
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
