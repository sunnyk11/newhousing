import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitUserFeedbackComponent } from './visit-user-feedback.component';

describe('VisitUserFeedbackComponent', () => {
  let component: VisitUserFeedbackComponent;
  let fixture: ComponentFixture<VisitUserFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitUserFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitUserFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
