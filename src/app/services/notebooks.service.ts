import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { Note } from '../models/notes.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class NotebooksService {

  private host: string = location.protocol + '//localhost';
  private port: string = (location.protocol === 'https:') ? '3031' : '3030';

  constructor(private http: HttpClient) { }

  getNotebooks(): Observable<any> {
    const url: string = this.host + ':' + this.port + '/notebooks';
    // console.log(`NotebooksService.getNotebooks() url: ${url}`);
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>('getNotebooks'))
      );
  }

  createNotebook(notebook: any): Observable<any> {
    const url: string = this.host + ':' + this.port + '/notebooks';
    // console.log(`NotebooksService.createNotebook() url: ${url}`);
    return this.http.post<any>(url, notebook, httpOptions)
      .pipe(
        tap(resp => {
          console.log('console.log(`NotebooksService.createNotebook() response');
          console.dir(resp);
        }),
        catchError(this.handleError<any>('createNotebook'))
      );
  }

  updateNotebook(notebook: any): Observable<any> {
    const url: string = this.host + ':' + this.port + '/notebook/' + notebook._id;
    // console.log(`NotebooksService.updateNotebook() url: ${url}`);
    return this.http.put<any>(url, notebook, httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateNotebook'))
      );
  }

  deleteNotebook(notebook_id: string): Observable<any> {
    const url: string = this.host + ':' + this.port + '/notebook/' + notebook_id;
    // console.log(`NotebooksService.deleteNotebook() url: ${url}`);
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError<any>('deleteNotebook'))
      );
  }

  getNotes(notebook_id: string): Observable<any> {
    const url: string = this.host + ':' + this.port + '/notes/' + notebook_id;
    // console.log(`NotebooksService.getNotes() url: ${url}`);
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>('getNotes'))
      );
  }

  getNote(note_id: string): Observable<any> {
    const url: string = this.host + ':' + this.port + '/note/' + note_id;
    // console.log(`NotebooksService.getNote() url: ${url}`);
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>('getNote'))
      );
  }

  createNote(note: Note): Observable<Note> {
    const url: string = this.host + ':' + this.port + '/notes/' + note.notebook;
    // console.log(`NotebooksService.createNote() url: ${url}`);
    return this.http.post<Note>(url, note, httpOptions)
      .pipe(
        catchError(this.handleError<any>('createNote'))
      );
  }

  updateNote(note: Note): Observable<Note> {
    const url: string = this.host + ':' + this.port + '/note/' + note._id;
    // console.log(`NotebooksService.updateNote() url: ${url}`);
    return this.http.put<Note>(url, note, httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateNote'))
      );
  }

  deleteNote(note_id: string): Observable<any> {
    const url: string = this.host + ':' + this.port + '/note/' + note_id;
    // console.log(`NotebooksService.deleteNote() url: ${url}`);
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError<any>('deleteNotebook'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
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
