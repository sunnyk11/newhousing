import { TestBed } from '@angular/core/testing';

import { MyPlansPageService } from './my-plans-page.service';

describe('MyPlansPageService', () => {
  let service: MyPlansPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPlansPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
