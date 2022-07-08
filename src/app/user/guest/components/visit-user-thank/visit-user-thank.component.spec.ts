import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitUserThankComponent } from './visit-user-thank.component';

describe('VisitUserThankComponent', () => {
  let component: VisitUserThankComponent;
  let fixture: ComponentFixture<VisitUserThankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitUserThankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitUserThankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
