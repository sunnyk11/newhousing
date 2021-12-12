import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceUserListComponent } from './update-service-user-list.component';

describe('UpdateServiceUserListComponent', () => {
  let component: UpdateServiceUserListComponent;
  let fixture: ComponentFixture<UpdateServiceUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateServiceUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServiceUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
