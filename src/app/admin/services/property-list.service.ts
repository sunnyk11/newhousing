import { Injectable } from '@angular/core';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyListService {

  constructor(private apiService: ApiService) { }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  
  get_property(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/admin_get_property";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  get_property_excel(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/admin_get_property_excel";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  
  get_search_user(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/admin_get_user/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  mobile_get_search_user(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/admin_mobile_user/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  
  
  getpagination(url: string,reqModel:any): Promise<Pagination> {
    const route = url;
    //console.log(route);
    return this.apiService.get_admin_pagination(route,reqModel).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
}
