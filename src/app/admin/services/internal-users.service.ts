import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InternalUsersService {

  constructor(private apiService: ApiService) { }

  getAllInternalUsers(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_all_internal_users";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }

  getInternalUserDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_internal_user_details/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }

  deleteInternalUser(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/delete_internal_user/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
}
