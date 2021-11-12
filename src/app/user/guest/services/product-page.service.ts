import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductPageService {

  constructor(
    private apiService: ApiService
  ) { }
  
  single_product_details(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/see"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  login_single_product_details(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_login_see"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  getsimilarproperty(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/similarproperty"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  login_getsimilarproperty(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/loginsimilarproperty"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  recently_product(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/recently_product_user"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
