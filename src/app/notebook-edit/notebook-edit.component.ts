import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notebook } from '../models/notebook';

@Component({
  selector: 'app-notebook-edit',
  templateUrl: './notebook-edit.component.html',
  styleUrls: ['./notebook-edit.component.scss']
})
export class NotebookEditComponent implements OnInit {

  @Input() notebook: Notebook;
  @Input() mode: string; // [edit, new]

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  errors = [];

  constructor() { }

  ngOnInit() {
    // console.log('NotebookEditComponent.ngOnInit()');
  }

  onClose(): void {
    this.close.emit(null);
  }

  onConfirm(): void {
    this.errors = [];
    if (this.notebook.name.length > 0) {
      this.save.emit(this.notebook);
      this.close.emit(null);
    } else {
      this.errors.push('You must give your notebook a name.');
    }
  }

}
