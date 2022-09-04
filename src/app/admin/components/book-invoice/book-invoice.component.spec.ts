import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookInvoiceComponent } from './book-invoice.component';

describe('BookInvoiceComponent', () => {
  let component: BookInvoiceComponent;
  let fixture: ComponentFixture<BookInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
