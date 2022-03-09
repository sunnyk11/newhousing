import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentSlipComponent } from './rent-slip.component';

describe('RentSlipComponent', () => {
  let component: RentSlipComponent;
  let fixture: ComponentFixture<RentSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentSlipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
