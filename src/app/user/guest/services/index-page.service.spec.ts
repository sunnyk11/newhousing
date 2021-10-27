import { TestBed } from '@angular/core/testing';

import { IndexPageService } from './index-page.service';

describe('IndexPageService', () => {
  let service: IndexPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
