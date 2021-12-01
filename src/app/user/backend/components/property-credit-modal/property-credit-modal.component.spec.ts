import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCreditModalComponent } from './property-credit-modal.component';

describe('PropertyCreditModalComponent', () => {
  let component: PropertyCreditModalComponent;
  let fixture: ComponentFixture<PropertyCreditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyCreditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyCreditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
