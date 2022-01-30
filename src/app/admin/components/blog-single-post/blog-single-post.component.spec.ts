import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSinglePostComponent } from './blog-single-post.component';

describe('BlogSinglePostComponent', () => {
  let component: BlogSinglePostComponent;
  let fixture: ComponentFixture<BlogSinglePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogSinglePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogSinglePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
