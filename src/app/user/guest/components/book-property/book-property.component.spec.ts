import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPropertyComponent } from './book-property.component';

describe('BookPropertyComponent', () => {
  let component: BookPropertyComponent;
  let fixture: ComponentFixture<BookPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
