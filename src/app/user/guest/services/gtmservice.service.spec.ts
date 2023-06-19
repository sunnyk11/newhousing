import { TestBed } from '@angular/core/testing';

import { GtmserviceService } from './gtmservice.service';

describe('GtmserviceService', () => {
  let service: GtmserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GtmserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
