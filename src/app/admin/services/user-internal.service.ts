import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UserInternalService {
  
  public _subject = new BehaviorSubject<any>('');

  constructor(private apiService: ApiService) { }
  public user_details = new BehaviorSubject<any>('');
  user_details_emit<T>(data: T){
    this._subject.next(data);
  }
  user_details_on<T>(): Observable<T>{
    return this._subject.asObservable();
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  
  create_user(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/create_user_byinternal";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  } 
  
  update_user_byinternal(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/update_user_byinternal";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  } 
  
  update_mobile_no(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/update_mobile_no_byinternal";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  } 
  update_email(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/update_email_byinternal";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  } 
  
  
  get_userlist_byinternal(): Promise<Pagination> {
    const route = "/api/admin/get_userlist_byinternal";
    return this.apiService.admin_get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
   
  delete_user(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/delete_user";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
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
