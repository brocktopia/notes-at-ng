import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../models/notes.model';

@Component({
  selector: 'app-note-map',
  templateUrl: './note-map.component.html',
  styleUrls: ['./note-map.component.scss']
})
export class NoteMapComponent implements OnInit {

  @Input() note: Note[];

  constructor() { }

  ngOnInit() {
  }

}
