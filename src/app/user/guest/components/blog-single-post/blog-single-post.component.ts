import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-single-post',
  templateUrl: './blog-single-post.component.html',
  styleUrls: ['./blog-single-post.component.css']
})
export class BlogSinglePostComponent implements OnInit {

  activatedRouteSnapshot = '';
  errorMessage = '';
  post_detail: any = [];
  sharedMessage:string = '';
  public showLoadingIndicator: boolean =false;
  images_folder: string = environment.ftpURL;

  constructor(private _ActivatedRoute:ActivatedRoute, private _router:Router, private blogService:BlogService) { }

  ngOnInit(): void {

    this.showLoadingIndicator = true;
    this.activatedRouteSnapshot = this._ActivatedRoute.snapshot.params.slug;
    //console.log(this.activatedRouteSnapshot);

    this.blogService.getPostDetails(this.activatedRouteSnapshot).subscribe(
      res => {
        
        //console.log(res);
        this.post_detail = res;
        //console.log(this.post_detail);
        this.showLoadingIndicator = false;
        this._router.navigate(['/blog-single-post', this.activatedRouteSnapshot ]);
        //this.gotoPostDetails(BLOG_API + '/blog-single-post', this.activatedRouteSnapshot);
        //this.gotoPostDetails('/blog-single-post', this.activatedRouteSnapshot);
      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error.message;
        console.log(err);
      }
    );
  }

}
