import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateAgentComponent } from './real-estate-agent.component';

describe('RealEstateAgentComponent', () => {
  let component: RealEstateAgentComponent;
  let fixture: ComponentFixture<RealEstateAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
