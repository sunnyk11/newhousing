import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepropertyRentComponent } from './updateproperty-rent.component';

describe('UpdatepropertyRentComponent', () => {
  let component: UpdatepropertyRentComponent;
  let fixture: ComponentFixture<UpdatepropertyRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatepropertyRentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepropertyRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
