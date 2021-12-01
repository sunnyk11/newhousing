import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepropertySalesComponent } from './updateproperty-sales.component';

describe('UpdatepropertySalesComponent', () => {
  let component: UpdatepropertySalesComponent;
  let fixture: ComponentFixture<UpdatepropertySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatepropertySalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepropertySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
