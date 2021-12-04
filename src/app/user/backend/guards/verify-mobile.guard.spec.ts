import { TestBed } from '@angular/core/testing';

import { VerifyMobileGuard } from './verify-mobile.guard';

describe('VerifyMobileGuard', () => {
  let guard: VerifyMobileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyMobileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
