import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Pagination } from 'src/app/user/components/models/pagination.model';


@Injectable({
  providedIn: 'root'
})
export class UserBankDetailsService {

  constructor(private apiService: ApiService) { }
  
  public _subject = new BehaviorSubject<any>('');
  
  // topbar bank details profile page refresh functionalty start
  public bank_details = new BehaviorSubject<any>('');
  bank_details_emit<T>(data: T){
    this._subject.next(data);
  }
  bank_details_on<T>(): Observable<T>{
    return this._subject.asObservable();
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }  
  get_userbank_details(): Promise<Pagination> {
    const route = "/api/admin/get_userbank_details";
    return this.apiService.admin_get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  get_payment_user(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/get_payment_user";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  get_payment_user_excel(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/get_payment_user_excel";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  get_userbank_history_id(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/get_userbank_history_id";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  } 
  delete_user_bank(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/bank_details_delete";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  update_bank_paytm_id(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/update_bank_paytm_id";
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
  
  getpagination1(url: string,reqModel:any): Promise<Pagination> {
    const route = url;
    //console.log(route);
    return this.apiService.get_admin_pagination(route+reqModel).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
  
  get_search_user(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/admin_get_search_user/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  mobile_get_search_user(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/admin_mobile_search_user/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  
  payment_user_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/admin_payment_user_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  payment_user_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/admin_payment_user_update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  get_property(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/admin_get_property_id";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  
}
