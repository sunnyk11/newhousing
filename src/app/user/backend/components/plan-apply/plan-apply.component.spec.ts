import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanApplyComponent } from './plan-apply.component';

describe('PlanApplyComponent', () => {
  let component: PlanApplyComponent;
  let fixture: ComponentFixture<PlanApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
