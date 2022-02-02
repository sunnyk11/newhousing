import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInternalUsersComponent } from './view-internal-users.component';

describe('ViewInternalUsersComponent', () => {
  let component: ViewInternalUsersComponent;
  let fixture: ComponentFixture<ViewInternalUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInternalUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInternalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
