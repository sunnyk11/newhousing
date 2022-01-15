import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServicesUserComponent } from './update-services-user.component';

describe('UpdateServicesUserComponent', () => {
  let component: UpdateServicesUserComponent;
  let fixture: ComponentFixture<UpdateServicesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateServicesUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServicesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
