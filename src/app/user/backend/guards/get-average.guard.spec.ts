import { TestBed } from '@angular/core/testing';

import { GetAverageGuard } from './get-average.guard';

describe('GetAverageGuard', () => {
  let guard: GetAverageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GetAverageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
