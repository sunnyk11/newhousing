import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class OfferBannerService {

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
   // service page 
   banner_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/banner_created";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  banner_Update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/banner_Update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }

  banner_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/banner_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }


  get_banner(): Promise<Pagination> {
    const route = "/api/admin/get_banner";
    return this.apiService.admin_get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }

  
  banner_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/update_banner_id"; 
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }



  getpagination(url: string): Promise<Pagination> {
    const route = url;
    return this.apiService.get_admin_pagination(route).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }


  
  delete_Banner(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_Banner";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }



  // listing page content create 
  listing_page_heading_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/listing_page_heading_create";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  get_listing_heading(): Promise<Pagination> {
    const route = "/api/admin/get_listing_heading";
    return this.apiService.admin_get(route).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  listing_page_heading_Update(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/listing_page_heading_Update";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  heading_status_changes(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/heading_status_changes";
    return this.apiService.admin_post<ResultModel>(route, reqModel);
  }
  
  delete_heading(reqModel:any): Observable<ResultModel> {
    const route = "/api/admin/delete_heading";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
}
