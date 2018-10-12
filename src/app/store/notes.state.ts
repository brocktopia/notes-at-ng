import { State, Action, StateContext } from '@ngxs/store';
import { NotebooksService } from '../services/notebooks.service';
import { tap, catchError } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Note} from '../models/notes.model';

export class GetNotes {
  static readonly type = '[Notes] GetNotes';
  constructor(public notebook_id: string) {}
}

export class GetNote {
  static readonly type = '[Notes] GetNote';
  constructor(public note_id: string) {}
}

export class CreateNote {
  static readonly type = '[Notes] CreateNote';
  constructor(public note: Note) {}
}

export class UpdateNote {
  static readonly type = '[Notes] UpdateNote';
  constructor(public note: Note) {}
}

export class DeleteNote {
  static readonly type = '[Notes] DeleteNote';
  constructor(public note_id: string) {}
}

export class SetActiveNote {
  static readonly type = '[Notes] SetActiveNote';
  constructor(public note: Note) {}
}

export class ShiftActiveNote {
  static readonly type = '[Notes] ShiftActiveNote';
  constructor(public isNext: boolean) {}
}

export class SetActiveNoteById {
  static readonly type = '[Notebooks] SetActiveNoteById';
  constructor(public note_id: string) {}
}

export interface NotesStateModel {
  all: Note[];
  active: Note;
  count: number;
}

@State<NotesStateModel>({
  name: 'notes',
  defaults: {
    all: [],
    active: null,
    count: 0
  }
})
export class NotesState {
  constructor(private notebooksService: NotebooksService) {}

  @Action(GetNotes)
  getNotes(ctx: StateContext<NotesStateModel>, action) {
    console.log(`notes.state.getNotes() notebook_id: ${action.notebook_id}`);
    return this.notebooksService.getNotes(action.notebook_id)
      .pipe(
        tap((data) => {
          console.log('notes.state.getNotes() data');
          console.dir(data);
          const state = ctx.getState();
          ctx.setState({
            ...state,
            all: data,
            count: data.length
          });
        },
          catchError(this.handleError<any>('getNotes'))
      ));

  }

  @Action(GetNote)
  getNote(ctx: StateContext<NotesStateModel>, action) {
    console.log(`notes.state.getNote() note_id: ${action.note_id}`);
    return this.notebooksService.getNote(action.note_id)
      .pipe(
        tap((data) => {
          console.log('notes.state.getNote() data');
          console.dir(data);
          const state = ctx.getState();
          ctx.setState({
            ...state,
            active: data
          });
        },
          catchError(this.handleError<any>('getNotes'))
      ));

  }

  @Action(CreateNote)
  createNote(ctx: StateContext<NotesStateModel>, action) {
    console.log(`notes.state.createNote() note name: ${action.note.name}`);
    return this.notebooksService.createNote(action.note)
      .pipe(
        tap((data) => {
            console.log('notes.state.createNote() data');
            console.dir(data);
            const state = ctx.getState();
            state.all.unshift(data);
            ctx.setState({
              ...state,
              active: data
            });
          },
          catchError(this.handleError<any>('createNote'))
        ));

  }

  @Action(UpdateNote)
  updateNote(ctx: StateContext<NotesStateModel>, action) {
    console.log(`notes.state.updateNote() note name: ${action.note.name}`);
    return this.notebooksService.updateNote(action.note)
      .pipe(
        tap((data) => {
            console.log('notes.state.updateNote() data');
            console.dir(data);
            const state = ctx.getState();
            if (state.all && state.all.length > 0) {
              // swap out note in all[]
              const activeIndex = state.all.findIndex(n => n._id === action.note._id);
              if (activeIndex > -1) {
                state.all.splice(activeIndex, 1, data);
              } else {
                throw({message: `Could not find index [${activeIndex}] for note [${action.note._id}]`});
              }
            }
            // otherwise could be deep-linked first load into notes view
            ctx.setState({
              ...state,
              active: data
            });
          },
          catchError(this.handleError<any>('updateNote'))
        ));
  }

  @Action(DeleteNote)
  deleteNote(ctx: StateContext<NotesStateModel>, action) {
    console.log(`notes.state.deleteNote() note id: ${action.note_id}`);
    return this.notebooksService.deleteNote(action.note_id)
      .pipe(
        tap((data) => {
            console.log('notes.state.deleteNote() data');
            console.dir(data);
            if (data.success) {
              const state = ctx.getState();
              if (state.all && state.all.length > 0) {
                // remove note from all[]
                const activeIndex = state.all.findIndex(n => n._id === action.note_id);
                if (activeIndex > -1) {
                  state.all.splice(activeIndex, 1);
                } else {
                  throw({message: `Could not find index [${activeIndex}] for note [${action.note._id}]`});
                }
              }
              // otherwise could be deep-linked first load into notes view
              ctx.setState({
                ...state,
                active: null
              });
            } else {
              throw({message: 'Failed to delete note.'});
            }
          },
          catchError(this.handleError<any>('deleteNote'))
        ));
  }

  @Action(SetActiveNote)
  setActiveNote(ctx: StateContext<NotesStateModel>, action: SetActiveNote) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      active: action.note
    });
  }

  @Action(ShiftActiveNote)
  shiftActiveNote(ctx: StateContext<NotesStateModel>, action: ShiftActiveNote) {
    const state = ctx.getState();
    // get active note index
    const activeId = state.active._id;
    const activeIndex = state.all.findIndex(n => n._id === activeId);
    let newNote: any;
    if (action.isNext) {
      newNote = (activeIndex < state.all.length) ? state.all[activeIndex + 1] : newNote = state.all[0];
    } else {
      newNote = (activeIndex > 0) ? state.all[activeIndex - 1] : newNote = state.all[state.all.length - 1];
    }
    ctx.setState({
      ...state,
      active: newNote
    });
  }

  @Action(SetActiveNoteById)
  setActiveNoteById(ctx: StateContext<NotesStateModel>, action: SetActiveNoteById) {
    const state = ctx.getState();
    const data = state.all.find((note: any) => {
      return note._id === action.note_id;
    });
    if (data) {
      ctx.setState({
        ...state,
        active: data
      });
    } else {
      throw({message: `Could not find note with id [${action.note_id}]`});
    }
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
