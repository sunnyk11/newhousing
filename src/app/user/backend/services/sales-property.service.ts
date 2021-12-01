import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SalesPropertyService {

  constructor(
    private apiService: ApiService
    ) { }

  product_insert_sales(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/insert_product_sale"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  property_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/property_get_id"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  product_sales_update(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_sales_update"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  delete_pro_img(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/delete_pro_img"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  delete_video(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/delete_video"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
