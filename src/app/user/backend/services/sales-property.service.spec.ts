import { TestBed } from '@angular/core/testing';

import { SalesPropertyService } from './sales-property.service';

describe('SalesPropertyService', () => {
  let service: SalesPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
