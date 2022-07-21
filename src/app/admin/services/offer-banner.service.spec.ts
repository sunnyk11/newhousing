import { TestBed } from '@angular/core/testing';

import { OfferBannerService } from './offer-banner.service';

describe('OfferBannerService', () => {
  let service: OfferBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
