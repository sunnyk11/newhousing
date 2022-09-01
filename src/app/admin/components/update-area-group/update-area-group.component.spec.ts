import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAreaGroupComponent } from './update-area-group.component';

describe('UpdateAreaGroupComponent', () => {
  let component: UpdateAreaGroupComponent;
  let fixture: ComponentFixture<UpdateAreaGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAreaGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAreaGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
