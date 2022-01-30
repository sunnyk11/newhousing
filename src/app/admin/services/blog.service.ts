import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { PaginatedPosts } from 'src/app/user/guest/models/paginated-posts.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private apiService: ApiService) { }

  create_post(reqModel: any): Observable<ResultModel> {
    const route = "/api/posts";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }

  getPosts(reqModel: any): Promise<PaginatedPosts> {
    const route = "/api/posts";
    return this.apiService.get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as PaginatedPosts
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }

  getPostDetails(slug: any): Observable<ResultModel> {
    const route = "/api/posts/";
    return this.apiService.get<ResultModel>(route + slug);
  }

  updatePostDetails(reqModel: any, slug: any): Observable<ResultModel> {
    const route = "/api/posts/update/";
    return this.apiService.admin_post<ResultModel>(route + slug, reqModel);
  }

  deletePost(reqModel: any): Observable<ResultModel> {
    const route = "/api/posts/delete/";
    return this.apiService.admin_delete<ResultModel>(route + reqModel);
  }
}
