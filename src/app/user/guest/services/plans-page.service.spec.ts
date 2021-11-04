import { TestBed } from '@angular/core/testing';

import { PlansPageService } from './plans-page.service';

describe('PlansPageService', () => {
  let service: PlansPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlansPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
