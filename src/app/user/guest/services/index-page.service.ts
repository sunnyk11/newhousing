import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import {  HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndexPageService {

  constructor(
    private apiService: ApiService
  ) { }
  
  getFeature_Property(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/get_product_featured";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  login_Feature_Property(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/get_product_wishlist";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  gettestimonial(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/testimonial";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getArtical(reqModel:any): Observable<ResultModel> {
    const route = "/api/posts_latest";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_Property(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/get_product";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
