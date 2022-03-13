import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  constructor(private apiService: ApiService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  
  // get_all_user(reqModel: any): Observable<ResultModel> {
  //   const route = "/api/admin/get_all_user";
  //   return this.apiService.get<ResultModel>(route, reqModel);
  // } 
  delete_user(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/delete_user";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  get_all_user(): Promise<Pagination> {
    const route = "/api/admin/get_all_user";
    return this.apiService.admin_get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  get_search_user(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/get_search_user";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  user_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/user_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  getpagination(url: string): Promise<Pagination> {
    const route = url;
    //console.log(route);
    return this.apiService.get_admin_pagination(route).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
}
