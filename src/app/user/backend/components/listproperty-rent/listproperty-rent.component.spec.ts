import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpropertyRentComponent } from './listproperty-rent.component';

describe('ListpropertyRentComponent', () => {
  let component: ListpropertyRentComponent;
  let fixture: ComponentFixture<ListpropertyRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListpropertyRentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpropertyRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
