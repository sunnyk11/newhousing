import { Injectable } from '@angular/core';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private login_check = new Subject<any>();

  constructor(
    private apiService: ApiService
    ) { }
  // topbar wishlist refresh functionalty start
  public _subject = new BehaviorSubject<any>('');
  emit<T>(data: T){
    this._subject.next(data);
  }
  on<T>(): Observable<T>{
    return this._subject.asObservable();
  }
  // topbar property comparision refresh functionalty start
  public pro_comp_subject = new BehaviorSubject<any>('');
  pro_comp_emit<T>(data: T){
    this.pro_comp_subject.next(data);
  }
  pro_comp_on<T>(): Observable<T>{
    return this.pro_comp_subject.asObservable();
  }
  getAmenities(reqModel:any): Observable<ResultModel> {
    const route = "/api/amenities";
    return this.apiService.get<ResultModel>(route, reqModel);
  }  
  getproductcategory(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/property_category";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getFeaturedproduct(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/feature_property";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  
  getrecently_product(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/user_recently_pro";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  sendUpdate(message: boolean,token:any,) {
    this.login_check.next({ text:message,token:token });
  }
  getUpdate(): Observable<any> {
    return this.login_check.asObservable();
  }
  wishlist_addd(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/wishlist";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  wishlist_remove(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/wishlistdelete";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  getwishlit_property(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/wishlist";
    return this.apiService.get1<ResultModel>(route, reqModel);
  } 
  product_comp(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_comp";
    return this.apiService.post<ResultModel>(route, reqModel);
  } 
  getproduct_comp(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_comp";
    return this.apiService.get1<ResultModel>(route, reqModel);
  }
  pro_comp_delete(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/pro_comp_delete";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  
}
