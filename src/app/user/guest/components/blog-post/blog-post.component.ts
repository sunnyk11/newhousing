import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {

  private activatedRouteSnapshot: any;

  constructor(private blogService: BlogService,
    private _ActivatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRouteSnapshot = this._ActivatedRoute.snapshot.params.slug;
    this.blogService.getPostDetails(this.activatedRouteSnapshot).subscribe(
      
    );
  }

}
