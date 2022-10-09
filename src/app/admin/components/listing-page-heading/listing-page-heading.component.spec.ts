import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingPageHeadingComponent } from './listing-page-heading.component';

describe('ListingPageHeadingComponent', () => {
  let component: ListingPageHeadingComponent;
  let fixture: ComponentFixture<ListingPageHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingPageHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingPageHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
