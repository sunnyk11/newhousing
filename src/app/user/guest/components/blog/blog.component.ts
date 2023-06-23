import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PaginatedPosts } from '../../models/paginated-posts.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  errorMessage = '';
  public images_folder: string = environment.ftpURL;
  public paginated_posts: PaginatedPosts;
  public total_pages: any;
  public returnedPosts: any;
  public showLoadingIndicator: boolean = false;

  constructor(private blogService: BlogService,
    private titleService: Title,
     private _router: Router) {
    this.paginated_posts = new PaginatedPosts();
  }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.titleService.setTitle('Blog');
    this.blogService.getPosts().then(
      paginatedPosts => {
        this.paginated_posts = paginatedPosts;
        this.showLoadingIndicator = false;
      }
    );
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.blogService.getPostsAtUrl(link_url).then(paginatedPosts => {
      this.paginated_posts = paginatedPosts;
      this.showLoadingIndicator = false;
    });
  }

  prevPage() {
    this.blogService.getPostsAtUrl(this.paginated_posts.prev_page_url).then(
      paginatedPosts => this.paginated_posts = paginatedPosts
    );
  }

  nextPage() {
    this.blogService.getPostsAtUrl(this.paginated_posts.next_page_url).then(
      paginatedPosts => this.paginated_posts = paginatedPosts
    );
  }
}
