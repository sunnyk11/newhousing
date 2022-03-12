import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class InternalUsersService {

  constructor(private apiService: ApiService) { }

  getAllInternalUsers(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_all_internal_users";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
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

  getInternalUserDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_internal_user_details/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }

  deleteInternalUser(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/delete_internal_user/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  user_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/user_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
}
