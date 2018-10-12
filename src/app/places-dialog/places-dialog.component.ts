import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-places-dialog',
  templateUrl: './places-dialog.component.html',
  styleUrls: ['./places-dialog.component.scss']
})
export class PlacesDialogComponent implements OnInit {

  @Input() places: any[];
  @Input() placeName: string;
  @Input() showMoreButton = false;

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() showMore: EventEmitter<any> = new EventEmitter();

  inputDelayIndex: any;

  constructor() { }

  ngOnInit() { }

  updatePlaceSearch(name): void {
    // console.log(`PlacesDialogComponent.closeDialog() placeName [${name}]`);
    if (this.inputDelayIndex) {
      clearInterval(this.inputDelayIndex);
    }
    this.inputDelayIndex = setTimeout(() => {
      this.filter.emit(name);
      this.inputDelayIndex = null;
    }, 500);
  }

  closeDialog(): void {
    // console.log(`PlacesDialogComponent.closeDialog()`);
    this.close.emit(null);
  }

  loadMore(): void {
    // console.log(`PlacesDialogComponent.loadMore()`);
    this.showMore.emit(null);
  }

  onPlaceSelect(place: any): void {
    // console.log(`PlacesDialogComponent.onPlaceSelect()`);
    this.save.emit(place);
    this.close.emit(null);
  }

}
