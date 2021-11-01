import { TestBed } from '@angular/core/testing';

import { ProductListingPageService } from './product-listing-page.service';

describe('ProductListingPageService', () => {
  let service: ProductListingPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListingPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
