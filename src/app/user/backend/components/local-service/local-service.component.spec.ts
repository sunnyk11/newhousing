import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalServiceComponent } from './local-service.component';

describe('LocalServiceComponent', () => {
  let component: LocalServiceComponent;
  let fixture: ComponentFixture<LocalServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
