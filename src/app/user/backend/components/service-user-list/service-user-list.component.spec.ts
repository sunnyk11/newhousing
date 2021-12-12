import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceUserListComponent } from './service-user-list.component';

describe('ServiceUserListComponent', () => {
  let component: ServiceUserListComponent;
  let fixture: ComponentFixture<ServiceUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
