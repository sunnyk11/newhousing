import { Injectable } from '@angular/core';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private login_check = new Subject<any>();

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

  sendUpdate(message: boolean) {
    console.log("Send Update called");
    this.login_check.next({ text:message });
  }

  getUpdate(): Observable<any> {
    console.log("Get Update called");
    return this.login_check.asObservable();
  }
}
