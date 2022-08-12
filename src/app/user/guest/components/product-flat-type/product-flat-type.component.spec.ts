import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFlatTypeComponent } from './product-flat-type.component';

describe('ProductFlatTypeComponent', () => {
  let component: ProductFlatTypeComponent;
  let fixture: ComponentFixture<ProductFlatTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFlatTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFlatTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
