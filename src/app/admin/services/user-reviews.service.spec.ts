import { TestBed } from '@angular/core/testing';

import { UserReviewsService } from './user-reviews.service';

describe('UserReviewsService', () => {
  let service: UserReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
