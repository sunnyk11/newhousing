import { TestBed } from '@angular/core/testing';

import { VerifyMobileService } from './verify-mobile.service';

describe('VerifyMobileService', () => {
  let service: VerifyMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
