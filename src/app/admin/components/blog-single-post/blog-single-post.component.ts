import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-single-post',
  templateUrl: './blog-single-post.component.html',
  styleUrls: ['./blog-single-post.component.css']
})
export class BlogSinglePostComponent implements OnInit {
  private activatedRouteSnapshot: any;
  public post_detail: any;
  public showLoadingIndicator: boolean =false;
  public images_folder: string = environment.ftpURL;

  constructor(private _ActivatedRoute:ActivatedRoute,
    private blogService: BlogService,
    private _router:Router) { }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.activatedRouteSnapshot = this._ActivatedRoute.snapshot.params.slug;

    this.blogService.getPostDetails(this.activatedRouteSnapshot).subscribe(
      res => {
        //console.log(res);
        this.post_detail = res;
        this.post_detail = this.post_detail[0];
        this.showLoadingIndicator = false;
        this._router.navigate(['/admin/admin-blog-single-post', this.activatedRouteSnapshot ]);
      },
      err => {
        // console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  editPost(postSlug: any) {
    this._router.navigate(['/admin/edit-blog-post', postSlug]);
  }

}
