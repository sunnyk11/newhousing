import { TestBed } from '@angular/core/testing';

import { InternalUsersService } from './internal-users.service';

describe('InternalUsersService', () => {
  let service: InternalUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
