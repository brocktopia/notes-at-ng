import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-dailog',
  templateUrl: './modal-dailog.component.html'
})
export class ModalDailogComponent implements OnInit {

  @Input() modalType: string; // [notify, confirm, yesno]

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    // console.log(`ModalDialogComponent.ngOnInit() type: ${this.modalType}`);
  }

  onClose(): void {
    this.close.emit(null);
  }

  onConfirm(): void {
    this.confirm.emit(null);
    this.close.emit(null);
  }

}
