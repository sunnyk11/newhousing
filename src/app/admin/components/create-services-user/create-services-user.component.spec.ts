import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServicesUserComponent } from './create-services-user.component';

describe('CreateServicesUserComponent', () => {
  let component: CreateServicesUserComponent;
  let fixture: ComponentFixture<CreateServicesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateServicesUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServicesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
