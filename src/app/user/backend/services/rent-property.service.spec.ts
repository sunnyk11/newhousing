import { TestBed } from '@angular/core/testing';

import { RentPropertyService } from './rent-property.service';

describe('RentPropertyService', () => {
  let service: RentPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
