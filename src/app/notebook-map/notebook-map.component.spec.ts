import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookMapComponent } from './notebook-map.component';

describe('NotebookMapComponent', () => {
  let component: NotebookMapComponent;
  let fixture: ComponentFixture<NotebookMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
