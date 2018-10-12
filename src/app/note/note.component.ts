import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GetNote, ShiftActiveNote, DeleteNote} from '../store/notes.state';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  @Select(state => state.notes.count) count$: Observable<any>;
  @Select(state => state.notes.active) note$: Observable<any>;
  @Select(state => state.notebooks.active) notebook$: Observable<any>;

  note: any;
  noteCount: number;
  isLoading = true;
  loadingMessage: 'Loading...';
  showNoteMap = false;
  showConfirmModal = false;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // console.log('NoteComponent.ngOnInit()');
    this.note$.subscribe(note => {
      if (note) {
        this.note = note;
        this.isLoading = false;
      } else {
        // Must be first load of deep-link url
        // Get notebook_id from route
        this.route.paramMap.subscribe(paramMap => {
          if (paramMap.has('note_id')) {
            const id: string = paramMap.get('note_id');
            if (id) {
              // Get Note
              this.store.dispatch(new GetNote(id))
                .subscribe(state => {
                  // Will trigger subscription with note reference
                });
            }
          }
        });
      }
    });
    // noteCount is used to determin if prev/next should be enabled
    this.count$.subscribe(count => {
      this.noteCount = count;
    });
  }

  deleteNote(): void {
    // console.log(`NoteComponent.deleteNote()`);
    this.showConfirmModal = true;
  }

  confirmNoteDelete(): void {
    // console.log(`NoteComponent.confirmNoteDelete()`);
    this.store.dispatch(new DeleteNote(this.note._id))
      .subscribe((res) => {
        this.closeNote();
      });
  }

  editNote(device): void { // device is used in the edit view to differentiate between desktop and mobile
    // console.log(`NoteComponent.editNote()`);
    this.router.navigate(['/note-edit/' + this.note._id], {queryParams: {'device': device}});
  }

  showNote(): void {
    // console.log(`NoteComponent.showNote()`);
    this.showNoteMap = false;
  }

  showMap(): void {
    // console.log(`NoteComponent.showMap()`);
    this.showNoteMap = true;
  }

  closeNote(): void { // go back to notebook
    // console.log(`NoteComponent.closeNote()`);
    this.router.navigate(['/notebook/' + this.note.notebook]);
  }

  nextNote(): void {
    // console.log(`NoteComponent.nextNote()`);
    this.store.dispatch(new ShiftActiveNote(true)) // true = forward false = backward
      // update the route
      .subscribe((state) => {
        this.router.navigate(['/note/' + state.notes.active._id], { replaceUrl: true });
      });
  }

  previousNote(): void {
    // console.log(`NoteComponent.previousNote()`);
    this.store.dispatch(new ShiftActiveNote(false)) // true = forward false = backward
      .subscribe((state) => {
        // update the route
        this.router.navigate(['/note/' + state.notes.active._id], { replaceUrl: true });
      });
  }

}
