import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class AreaListService {

  constructor(private apiService: ApiService) { }
  
  public _subject = new BehaviorSubject<any>('');

  public user_details = new BehaviorSubject<any>('');
  banner_details_emit<T>(data: T){
    this._subject.next(data);
  }
  banner_details_on<T>(): Observable<T>{
    return this._subject.asObservable();
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  // state  
  state_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/state_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }

  state_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/state_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  get_state(): Promise<Pagination> {
    const route = "/api/admin/get_state";
    return this.apiService.admin_get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  get_state_data(): Observable<ResultModel> {
    const route = "/api/admin/get_state_data";
    return this.apiService.admin_get<ResultModel>(route);
  }
  state_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/state_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  delete_area(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_area";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
// district  
  district_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/district_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  get_district_byid(reqModel:any): Promise<Pagination> {
    const route = "/api/admin/get_district_byid";
    return this.apiService.admin_post(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  district_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/district_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  district_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/district_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  delete_district(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_district";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  // locality functuonalty
  get_district_search(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/search_district";
    return this.apiService.admin_post<ResultModel>(route,reqModel);
  }
  
  locality_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/locality_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  get_locality_byid(reqModel:any): Promise<Pagination> {
    const route = "/api/admin/get_locality_byid";
    return this.apiService.admin_post(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  locality_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/locality_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  locality_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/edit_locality_id"; 
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  
  locality_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/locality_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  delete_locality(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_locality";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  // sublocality functionalty
  get_locality_search(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/search_locality";
    return this.apiService.admin_post<ResultModel>(route,reqModel);
  }
  
  get_locality_searching(reqModel:any): Promise<Pagination> {
    const route = "/api/admin/get_locality_searching";
    return this.apiService.admin_post(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  sub_locality_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/sub_locality_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  get_sub_locality(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_sub_locality";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  sub_locality_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/sub_locality_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  sub_locality_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/sub_locality_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  get_sub_locality_searching(reqModel:any): Promise<Pagination> {
    const route = "/api/admin/get_sub_locality_searching";
    return this.apiService.admin_post(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  delete_sub_locality(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_sub_locality";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  sub_locality_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/edit_sub_locality_id"; 
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  get_sub_locality_byid(reqModel:any): Promise<Pagination> {
    const route = "/api/admin/get_sub_locality_byid";
    return this.apiService.admin_post(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }

  getpagination(url: string): Promise<Pagination> {
    const route = url;
    return this.apiService.get_admin_pagination(route).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
  
  getpagination1(url: string,reqModel:any): Promise<Pagination> {
    const route = url;
    return this.apiService.post_pagination_admin(route,reqModel).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }


  // area group functionalty
  
  area_group_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/area_group_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  area_group_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/area_group_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  area_group_name_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/area_group_name_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }

  get_group_list(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/get_group_list";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  group_details_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/get_group_details_id"; 
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  
  delete_group(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_group";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }

  
}
