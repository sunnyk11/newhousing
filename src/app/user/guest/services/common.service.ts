import { Injectable } from '@angular/core';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private apiService: ApiService
    ) { }

  getAmenities(reqModel:any): Observable<ResultModel> {
    const route = "/api/amenities";
    return this.apiService.get<ResultModel>(route, reqModel);
  }  
  getproductcategory(reqModel:any): Observable<ResultModel> {
    const route = "/api/property_type";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getFeaturedproduct(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/feature_property";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
