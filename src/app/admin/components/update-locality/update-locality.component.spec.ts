import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLocalityComponent } from './update-locality.component';

describe('UpdateLocalityComponent', () => {
  let component: UpdateLocalityComponent;
  let fixture: ComponentFixture<UpdateLocalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLocalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
