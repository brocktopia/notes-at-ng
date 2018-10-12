import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesDialogComponent } from './places-dialog.component';

describe('PlacesDialogComponent', () => {
  let component: PlacesDialogComponent;
  let fixture: ComponentFixture<PlacesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
