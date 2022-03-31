import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAppointmentComponent } from './fixed-appointment.component';

describe('FixedAppointmentComponent', () => {
  let component: FixedAppointmentComponent;
  let fixture: ComponentFixture<FixedAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
