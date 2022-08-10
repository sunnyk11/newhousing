import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRentSlipComponent } from './property-rent-slip.component';

describe('PropertyRentSlipComponent', () => {
  let component: PropertyRentSlipComponent;
  let fixture: ComponentFixture<PropertyRentSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyRentSlipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyRentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
