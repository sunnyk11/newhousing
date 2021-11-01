import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyViewedProductComponent } from './recently-viewed-product.component';

describe('RecentlyViewedProductComponent', () => {
  let component: RecentlyViewedProductComponent;
  let fixture: ComponentFixture<RecentlyViewedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyViewedProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
