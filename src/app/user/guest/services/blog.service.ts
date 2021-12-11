import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { PaginatedPosts } from '../models/paginated-posts.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getPostDetails(slug: any): Observable<ResultModel> {
    const route = "/api/posts/";
    return this.apiService.get<ResultModel>(route + slug);
  }

  getPosts(): Promise<PaginatedPosts>  {
    const route = "/api/posts";
    return this.apiService.get(route).toPromise().then(
      (response) => {
        console.log(response);
        return response as PaginatedPosts
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }

  getPostsAtUrl(url: string): Promise<PaginatedPosts> {
    const route = url;
    console.log(route);
    return this.http.get(route).toPromise().then(
      (response) => {
        console.log(response);
      return response as PaginatedPosts
    })
    .catch(this.handleError);
  }
}
