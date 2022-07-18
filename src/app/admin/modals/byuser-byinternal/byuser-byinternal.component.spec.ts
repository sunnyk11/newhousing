import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByuserByinternalComponent } from './byuser-byinternal.component';

describe('ByuserByinternalComponent', () => {
  let component: ByuserByinternalComponent;
  let fixture: ComponentFixture<ByuserByinternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByuserByinternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByuserByinternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
