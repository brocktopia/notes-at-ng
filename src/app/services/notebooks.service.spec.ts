import { TestBed, inject } from '@angular/core/testing';

import { NotebooksService } from './notebooks.service';

describe('NotebooksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotebooksService]
    });
  });

  it('should be created', inject([NotebooksService], (service: NotebooksService) => {
    expect(service).toBeTruthy();
  }));
});
