import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListingDetailsComponent } from './product-listing-details.component';

describe('ProductListingDetailsComponent', () => {
  let component: ProductListingDetailsComponent;
  let fixture: ComponentFixture<ProductListingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductListingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
