import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RentPropertyService {

  constructor(
    private apiService: ApiService
    ) { }

  product_insert_rent(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/insert_product_rent"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  property_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/property_get_id"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  product_rent_update(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_rent_update"; 
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

  get_areas(): any {
    const route = "/api/auth/get_areas";
    return this.apiService.get<ResultModel>(route);
  }
}
