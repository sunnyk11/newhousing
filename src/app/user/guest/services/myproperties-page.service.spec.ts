import { TestBed } from '@angular/core/testing';

import { MypropertiesPageService } from './myproperties-page.service';

describe('MypropertiesPageService', () => {
  let service: MypropertiesPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MypropertiesPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
