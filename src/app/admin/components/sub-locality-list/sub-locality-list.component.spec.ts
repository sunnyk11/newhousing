import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLocalityListComponent } from './sub-locality-list.component';

describe('SubLocalityListComponent', () => {
  let component: SubLocalityListComponent;
  let fixture: ComponentFixture<SubLocalityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubLocalityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLocalityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
