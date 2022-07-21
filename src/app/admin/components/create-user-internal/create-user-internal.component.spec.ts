import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserInternalComponent } from './create-user-internal.component';

describe('CreateUserInternalComponent', () => {
  let component: CreateUserInternalComponent;
  let fixture: ComponentFixture<CreateUserInternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserInternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
