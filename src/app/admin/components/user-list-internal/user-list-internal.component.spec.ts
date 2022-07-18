import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListInternalComponent } from './user-list-internal.component';

describe('UserListInternalComponent', () => {
  let component: UserListInternalComponent;
  let fixture: ComponentFixture<UserListInternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListInternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
