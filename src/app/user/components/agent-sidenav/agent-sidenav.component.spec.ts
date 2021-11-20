import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSidenavComponent } from './agent-sidenav.component';

describe('AgentSidenavComponent', () => {
  let component: AgentSidenavComponent;
  let fixture: ComponentFixture<AgentSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
