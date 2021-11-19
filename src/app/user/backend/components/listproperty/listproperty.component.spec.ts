import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpropertyComponent } from './listproperty.component';

describe('ListpropertyComponent', () => {
  let component: ListpropertyComponent;
  let fixture: ComponentFixture<ListpropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListpropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
