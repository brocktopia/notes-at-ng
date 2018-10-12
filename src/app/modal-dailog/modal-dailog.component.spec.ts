import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDailogComponent } from './modal-dailog.component';

describe('ModalDailogComponent', () => {
  let component: ModalDailogComponent;
  let fixture: ComponentFixture<ModalDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
