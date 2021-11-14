import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPaymentSummaryComponent } from './pro-payment-summary.component';

describe('ProPaymentSummaryComponent', () => {
  let component: ProPaymentSummaryComponent;
  let fixture: ComponentFixture<ProPaymentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProPaymentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProPaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
