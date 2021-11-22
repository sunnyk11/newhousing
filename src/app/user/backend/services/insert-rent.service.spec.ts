import { TestBed } from '@angular/core/testing';

import { InsertRentService } from './insert-rent.service';

describe('InsertRentService', () => {
  let service: InsertRentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsertRentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
