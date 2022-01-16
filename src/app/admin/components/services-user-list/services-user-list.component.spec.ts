import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesUserListComponent } from './services-user-list.component';

describe('ServicesUserListComponent', () => {
  let component: ServicesUserListComponent;
  let fixture: ComponentFixture<ServicesUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
