import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVisitPopupComponent } from './user-visit-popup.component';

describe('UserVisitPopupComponent', () => {
  let component: UserVisitPopupComponent;
  let fixture: ComponentFixture<UserVisitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserVisitPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVisitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
