import { TestBed } from '@angular/core/testing';

import { ContactPageService } from './contact-page.service';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
