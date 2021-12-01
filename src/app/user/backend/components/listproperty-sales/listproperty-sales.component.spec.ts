import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpropertySalesComponent } from './listproperty-sales.component';

describe('ListpropertySalesComponent', () => {
  let component: ListpropertySalesComponent;
  let fixture: ComponentFixture<ListpropertySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListpropertySalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpropertySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
