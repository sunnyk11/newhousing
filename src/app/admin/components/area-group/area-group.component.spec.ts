import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaGroupComponent } from './area-group.component';

describe('AreaGroupComponent', () => {
  let component: AreaGroupComponent;
  let fixture: ComponentFixture<AreaGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
