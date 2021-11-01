import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepagefeatureComponent } from './homepagefeature.component';

describe('HomepagefeatureComponent', () => {
  let component: HomepagefeatureComponent;
  let fixture: ComponentFixture<HomepagefeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepagefeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepagefeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
