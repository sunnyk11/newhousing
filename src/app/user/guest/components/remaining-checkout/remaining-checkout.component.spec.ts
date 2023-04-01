import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingCheckoutComponent } from './remaining-checkout.component';

describe('RemainingCheckoutComponent', () => {
  let component: RemainingCheckoutComponent;
  let fixture: ComponentFixture<RemainingCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemainingCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
