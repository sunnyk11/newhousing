import { TestBed } from '@angular/core/testing';

import { LocalServiceProviderService } from './local-service-provider.service';

describe('LocalServiceProviderService', () => {
  let service: LocalServiceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalServiceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
