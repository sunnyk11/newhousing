import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpDisclaimerComponent } from './ip-disclaimer.component';

describe('IpDisclaimerComponent', () => {
  let component: IpDisclaimerComponent;
  let fixture: ComponentFixture<IpDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpDisclaimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
