import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteMapComponent } from './note-map.component';

describe('NoteMapComponent', () => {
  let component: NoteMapComponent;
  let fixture: ComponentFixture<NoteMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
