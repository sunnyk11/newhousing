import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUserListComponent } from './payment-user-list.component';

describe('PaymentUserListComponent', () => {
  let component: PaymentUserListComponent;
  let fixture: ComponentFixture<PaymentUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
