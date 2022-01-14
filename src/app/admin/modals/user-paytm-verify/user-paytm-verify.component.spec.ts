import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaytmVerifyComponent } from './user-paytm-verify.component';

describe('UserPaytmVerifyComponent', () => {
  let component: UserPaytmVerifyComponent;
  let fixture: ComponentFixture<UserPaytmVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPaytmVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaytmVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
