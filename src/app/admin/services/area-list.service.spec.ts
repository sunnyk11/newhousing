import { TestBed } from '@angular/core/testing';

import { AreaListService } from './area-list.service';

describe('AreaListService', () => {
  let service: AreaListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
