import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatedPosts } from 'src/app/user/guest/models/paginated-posts.model';
import { BlogService } from '../../services/blog.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-blog-posts',
  templateUrl: './view-blog-posts.component.html',
  styleUrls: ['./view-blog-posts.component.css']
})
export class ViewBlogPostsComponent implements OnInit {

  @ViewChild('closeDeleteModal')DeletemodalClose:any;

  public paginated_posts: PaginatedPosts;
  public images_folder: string = environment.ftpURL;
  public showLoadingIndicator: boolean = false;
  public delete_post_details: any;

  constructor(private blogService: BlogService,
    private toastr: ToastrService,
    private router: Router) {
    this.paginated_posts = new PaginatedPosts();
   }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.blogService.getPosts({ param: null }).then(paginatedPosts => {
      this.paginated_posts = paginatedPosts;
      this.showLoadingIndicator = false;
    });
  }

  viewPost() {

  }

  deletePost(postDetails: any) {
    this.delete_post_details = postDetails;
    //console.log(this.delete_post_details);
  }

  delete_post(post_slug: any) {
    this.showLoadingIndicator = true;
    this.blogService.deletePost(post_slug).subscribe(
      res => {
        this.showLoadingIndicator = false;
        this.toastr.success("Post Deleted Successfully");
        this.DeletemodalClose.nativeElement.click();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
}
