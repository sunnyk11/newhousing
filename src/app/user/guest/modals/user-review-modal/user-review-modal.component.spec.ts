import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewModalComponent } from './user-review-modal.component';

describe('UserReviewModalComponent', () => {
  let component: UserReviewModalComponent;
  let fixture: ComponentFixture<UserReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
