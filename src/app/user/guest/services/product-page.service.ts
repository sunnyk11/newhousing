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
  getsimilarproperty(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/similarproperty"; 
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
