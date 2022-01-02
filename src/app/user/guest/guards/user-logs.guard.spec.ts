import { TestBed } from '@angular/core/testing';

import { UserLogsGuard } from './user-logs.guard';

describe('UserLogsGuard', () => {
  let guard: UserLogsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserLogsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
