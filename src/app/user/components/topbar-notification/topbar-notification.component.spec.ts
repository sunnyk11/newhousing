import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarNotificationComponent } from './topbar-notification.component';

describe('TopbarNotificationComponent', () => {
  let component: TopbarNotificationComponent;
  let fixture: ComponentFixture<TopbarNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbarNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
