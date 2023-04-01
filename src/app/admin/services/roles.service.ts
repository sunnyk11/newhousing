import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/user/services/api.service';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private apiService: ApiService) { }

  getPermissions(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_permissions";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  createRole(reqModel: any): Observable<ResultModel> {
    const route = "/api/create_role";
    return this.apiService.post<ResultModel>(route, reqModel);
  }

  getRoles(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_roles";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_area_group(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_area_group";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getRolePermissions(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_role_permissions";
    return this.apiService.post<ResultModel>(route, {role_id: reqModel});
  }

  editRole(role_id:any, permissionsArray: any) {
    const route = "/api/edit_role";
    return this.apiService.post<ResultModel>(route, {role_id: role_id, permissionsArray: permissionsArray});
  }

  deleteRole(role_id: any) {
    const route = "/api/delete_role";
    return this.apiService.post<ResultModel>(route, {role_id: role_id});
  }

  createUser(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/internal_user_signup";
    return this.apiService.post<ResultModel>(route, reqModel);
  }

  getUserPermissions(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_user_permissions/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  getUserRoles(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_user_roles/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  getUsergroup(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/getUsergroup/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }

  editUserRoles(user_id:any, rolesArray: any) {
    const route = "/api/auth/edit_user_roles";
    return this.apiService.admin_post<ResultModel>(route, {user_id: user_id, rolesArray: rolesArray});
  }
  editUsergroup(user_id:any, rolesArray: any) {
    const route = "/api/auth/edit_user_group";
    return this.apiService.admin_post<ResultModel>(route, {user_id: user_id, rolesArray: rolesArray});
  }
 }
