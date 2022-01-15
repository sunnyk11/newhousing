import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UserReviewsService {

  constructor(private apiService: ApiService) { }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  
  get_reviews(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/get_reviews";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  get_reviews1(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/get_reviews";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  reviews_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/reviews_status_changes";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  user_reviews_delete(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/user_reviews_delete";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  
  getpagination(url: string): Promise<Pagination> {
    const route = url;
    console.log(route);
    return this.apiService.get_pagination(route).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
}
