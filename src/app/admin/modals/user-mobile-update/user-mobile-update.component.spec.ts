import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMobileUpdateComponent } from './user-mobile-update.component';

describe('UserMobileUpdateComponent', () => {
  let component: UserMobileUpdateComponent;
  let fixture: ComponentFixture<UserMobileUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMobileUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMobileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
