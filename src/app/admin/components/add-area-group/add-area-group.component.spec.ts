import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAreaGroupComponent } from './add-area-group.component';

describe('AddAreaGroupComponent', () => {
  let component: AddAreaGroupComponent;
  let fixture: ComponentFixture<AddAreaGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAreaGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAreaGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
