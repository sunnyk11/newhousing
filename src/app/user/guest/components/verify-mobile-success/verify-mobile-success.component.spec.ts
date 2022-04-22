import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMobileSuccessComponent } from './verify-mobile-success.component';

describe('VerifyMobileSuccessComponent', () => {
  let component: VerifyMobileSuccessComponent;
  let fixture: ComponentFixture<VerifyMobileSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyMobileSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMobileSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
