import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceUserComponent } from './create-service-user.component';

describe('CreateServiceUserComponent', () => {
  let component: CreateServiceUserComponent;
  let fixture: ComponentFixture<CreateServiceUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateServiceUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServiceUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
