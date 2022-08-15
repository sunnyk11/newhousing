import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubLocalityComponent } from './update-sub-locality.component';

describe('UpdateSubLocalityComponent', () => {
  let component: UpdateSubLocalityComponent;
  let fixture: ComponentFixture<UpdateSubLocalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSubLocalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubLocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
